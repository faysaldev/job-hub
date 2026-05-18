import { Server as SocketIOServer, Socket } from "socket.io";
import { Server } from "http";
import jwt from "jsonwebtoken";
import redis from "./redis";
import messageServices from "../domains/Messages/message.services";
import conversationService from "../domains/Conversations/conversations.services";
import * as notificationService from "../domains/Notifications/notifications.service";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
  userName?: string;
}

// ─── Redis Key Helpers ────────────────────────────────────────────────────────

const ONLINE_USERS_KEY = "online:users"; // hash userId → socketId
const userLastSeenKey = (uid: string) => `user:lastSeen:${uid}`;
const notificationsCacheKey = (uid: string) => `notifications:${uid}`;
const messagesCacheKey = (convId: string, page: number) =>
  `messages:${convId}:${page}`;

const NOTIFICATION_DELAY_MS = 3 * 60 * 1000; // 3 minutes

// ─── Singleton IO ─────────────────────────────────────────────────────────────

let _io: SocketIOServer;

export const getIO = (): SocketIOServer => _io;

export const isUserOnline = async (userId: string): Promise<boolean> => {
  const socketId = await redis.hget(ONLINE_USERS_KEY, userId);
  return !!socketId;
};

export const getSocketIdForUser = async (
  userId: string,
): Promise<string | null> => {
  return await redis.hget(ONLINE_USERS_KEY, userId);
};

// ─── Cache helpers ────────────────────────────────────────────────────────────

async function invalidateMessagesCache(conversationId: string) {
  const keys = await redis.keys(`messages:${conversationId}:*`);
  if (keys.length > 0) await redis.del(...keys);
}

// ─── Get receiver role from DB ────────────────────────────────────────────────

async function getReceiverRole(receiverId: string): Promise<string> {
  try {
    // dynamic import to avoid circular deps
    const UserModel = (await import("../domains/User/user.model")).default;
    const user = await UserModel.findById(receiverId).select("role").lean();
    return (user as any)?.role ?? "seeker";
  } catch {
    return "seeker";
  }
}

// ─── Main Setup ───────────────────────────────────────────────────────────────

const setUpSocketIO = (server: Server) => {
  _io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    connectionStateRecovery: { maxDisconnectionDuration: 2 * 60 * 1000 },
  });

  // ─── JWT Auth Middleware ────────────────────────────────────────────────────
  _io.use((socket: AuthenticatedSocket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) return next(new Error("Authentication error: No token"));

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      socket.userName = decoded.name;
      next();
    } catch {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  _io.on("connection", async (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    console.log(`[Socket] User connected: ${userId} (${socket.id})`);

    // ── Mark online ──────────────────────────────────────────────────────────
    await redis.hset(ONLINE_USERS_KEY, userId, socket.id);
    await redis.del(userLastSeenKey(userId));
    socket.broadcast.emit("user:status", { userId, isOnline: true });

    // ── Auto-join personal room so server can push to specific user ──────────
    socket.join(`user:${userId}`);

    // ════════════════════════════════════════════════════════════════
    //  CONVERSATIONS
    // ════════════════════════════════════════════════════════════════

    socket.on("conversations:get", async (data?: { search?: string }) => {
      try {
        let conversations =
          await conversationService.getUserConversationsService(userId);
        if (data?.search && data.search.trim() !== "") {
          const query = data.search.toLowerCase().trim();
          conversations = conversations.filter((conv: any) => {
            const other = conv.participants.find(
              (p: any) => p._id.toString() !== userId,
            );
            return other?.name?.toLowerCase().includes(query);
          });
        }
        socket.emit("conversations:loaded", { conversations });
      } catch {
        socket.emit("socket:error", { message: "Failed to load conversations" });
      }
    });

    // ════════════════════════════════════════════════════════════════
    //  MESSAGES
    // ════════════════════════════════════════════════════════════════

    socket.on(
      "conversation:join",
      ({ conversationId }: { conversationId: string }) => {
        socket.join(`conversation:${conversationId}`);
      },
    );

    socket.on(
      "conversation:leave",
      ({ conversationId }: { conversationId: string }) => {
        socket.leave(`conversation:${conversationId}`);
      },
    );

    socket.on(
      "messages:get",
      async ({
        conversationId,
        page = 1,
        limit = 20,
      }: {
        conversationId: string;
        page: number;
        limit: number;
      }) => {
        try {
          const cacheKey = messagesCacheKey(conversationId, page);
          const cached = await redis.get(cacheKey);
          if (cached) {
            socket.emit("messages:loaded", JSON.parse(cached));
            return;
          }

          const result = await messageServices.getAllMessagesService(
            conversationId,
            { page, limit },
          );

          const payload = {
            messages: result.messages,
            pagination: result.pagination,
            conversationId,
          };

          // cache 60s
          await redis.setex(cacheKey, 60, JSON.stringify(payload));
          socket.emit("messages:loaded", payload);
        } catch {
          socket.emit("socket:error", { message: "Failed to load messages" });
        }
      },
    );

    socket.on(
      "message:send",
      async ({
        conversationId,
        receiverId,
        content,
      }: {
        conversationId: string;
        receiverId: string;
        content: string;
      }) => {
        try {
          const message = await messageServices.createMessageService({
            conversationId,
            senderId: userId,
            receiverId,
            content,
          });

          // Invalidate cache
          await invalidateMessagesCache(conversationId);

          // Broadcast to conversation room
          _io
            .to(`conversation:${conversationId}`)
            .emit("message:new", { message });

          // Refresh conversations list for both parties
          const [senderConvs, receiverConvs] = await Promise.all([
            conversationService.getUserConversationsService(userId),
            conversationService.getUserConversationsService(receiverId),
          ]);

          socket.emit("conversations:loaded", { conversations: senderConvs });
          _io
            .to(`user:${receiverId}`)
            .emit("conversations:loaded", { conversations: receiverConvs });

          // ── Offline notification logic ────────────────────────────────────
          const online = await isUserOnline(receiverId);
          if (!online) {
            const lastSeen = await redis.get(userLastSeenKey(receiverId));
            const now = Date.now();
            const offlineMs = lastSeen ? now - parseInt(lastSeen) : Infinity;

            if (offlineMs > NOTIFICATION_DELAY_MS) {
              const receiverRole = await getReceiverRole(receiverId);
              const link =
                receiverRole === "recruiter"
                  ? "/recruiter/interviews"
                  : "/job-seeker/messages";

              try {
                const notification = await notificationService.createNotification({
                  title: `New message from ${socket.userName || "Someone"}`,
                  link,
                  sender: userId,
                  receiver: receiverId,
                });

                // Invalidate receiver's notifications cache
                await redis.del(notificationsCacheKey(receiverId));

                // Push notification if receiver comes online (stored in DB)
                // Also send via socket to receiver's personal room if they reconnect
                _io
                  .to(`user:${receiverId}`)
                  .emit("notification:new", { notification });
              } catch (err) {
                console.error("[Socket] Failed to create notification:", err);
              }
            }
          }
        } catch (err: any) {
          socket.emit("socket:error", {
            message: err.message || "Failed to send message",
          });
        }
      },
    );

    socket.on(
      "message:edit",
      async ({
        messageId,
        content,
        conversationId,
      }: {
        messageId: string;
        content: string;
        conversationId: string;
      }) => {
        try {
          const message = await messageServices.editMessageService(
            messageId,
            content,
          );
          await invalidateMessagesCache(conversationId);
          _io
            .to(`conversation:${conversationId}`)
            .emit("message:edited", { message });
        } catch (err: any) {
          socket.emit("socket:error", {
            message: err.message || "Failed to edit message",
          });
        }
      },
    );

    socket.on(
      "message:delete",
      async ({
        messageId,
        conversationId,
      }: {
        messageId: string;
        conversationId: string;
      }) => {
        try {
          await messageServices.deleteMessageService(messageId);
          await invalidateMessagesCache(conversationId);
          _io
            .to(`conversation:${conversationId}`)
            .emit("message:deleted", { messageId });
        } catch (err: any) {
          socket.emit("socket:error", {
            message: err.message || "Failed to delete message",
          });
        }
      },
    );

    socket.on(
      "message:read",
      async ({
        messageId,
        conversationId,
      }: {
        messageId: string;
        conversationId: string;
      }) => {
        try {
          await messageServices.markMessageAsReadService(messageId, userId);
          await invalidateMessagesCache(conversationId);
          _io
            .to(`conversation:${conversationId}`)
            .emit("message:read", { messageId, isRead: true });
        } catch (err: any) {
          socket.emit("socket:error", {
            message: err.message || "Failed to mark message as read",
          });
        }
      },
    );

    // ════════════════════════════════════════════════════════════════
    //  NOTIFICATIONS
    // ════════════════════════════════════════════════════════════════

    socket.on(
      "notifications:get",
      async ({
        page = 1,
        limit = 10,
      }: {
        page?: number;
        limit?: number;
      }) => {
        try {
          // Cache only page 1
          if (page === 1) {
            const cached = await redis.get(notificationsCacheKey(userId));
            if (cached) {
              socket.emit("notifications:loaded", JSON.parse(cached));
              return;
            }
          }

          const result = await notificationService.getUserNotifications(
            userId,
            page,
            limit,
          );

          const payload = {
            notifications: result.notifications,
            meta: {
              total: result.total,
              page: result.page,
              limit: result.limit,
              totalPages: result.totalPages,
            },
          };

          if (page === 1) {
            await redis.setex(
              notificationsCacheKey(userId),
              300,
              JSON.stringify(payload),
            );
          }

          socket.emit("notifications:loaded", payload);
        } catch {
          socket.emit("socket:error", {
            message: "Failed to load notifications",
          });
        }
      },
    );

    socket.on(
      "notification:read",
      async ({ notificationId }: { notificationId: string }) => {
        try {
          const notification = await notificationService.markAsRead(
            notificationId,
            userId,
          );
          await redis.del(notificationsCacheKey(userId));
          if (notification) {
            socket.emit("notification:updated", { notification });
          }
        } catch {
          socket.emit("socket:error", {
            message: "Failed to mark notification as read",
          });
        }
      },
    );

    socket.on("notification:readAll", async () => {
      try {
        await notificationService.markAllAsRead(userId);
        await redis.del(notificationsCacheKey(userId));
        socket.emit("notifications:allRead");
      } catch {
        socket.emit("socket:error", {
          message: "Failed to mark all notifications as read",
        });
      }
    });

    socket.on(
      "notification:delete",
      async ({ notificationId }: { notificationId: string }) => {
        try {
          await notificationService.deleteNotification(notificationId, userId);
          await redis.del(notificationsCacheKey(userId));
          socket.emit("notification:deleted", { notificationId });
        } catch {
          socket.emit("socket:error", {
            message: "Failed to delete notification",
          });
        }
      },
    );

    // ════════════════════════════════════════════════════════════════
    //  DISCONNECT
    // ════════════════════════════════════════════════════════════════

    socket.on("disconnect", async () => {
      console.log(`[Socket] User disconnected: ${userId}`);
      await redis.hdel(ONLINE_USERS_KEY, userId);
      await redis.set(userLastSeenKey(userId), Date.now().toString());
      socket.broadcast.emit("user:status", { userId, isOnline: false });
    });
  });

  return _io;
};

export default setUpSocketIO;
