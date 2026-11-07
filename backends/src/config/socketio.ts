import { Server as SocketIOServer, Socket } from "socket.io";
import { Server } from "node:http";
import redis from "./redis";
import { isAllowedOrigin, allowedOrigins } from "./cors";
import { verifyAccess } from "../domains/Auth/auth.token.services";
import messageServices from "../domains/Messages/message.services";
import conversationService from "../domains/Conversations/conversations.services";
import * as notifications from "../domains/Notifications/notifications.service";
import { AppError } from "../lib/errors";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";

interface AuthSocket extends Socket { userId?: string; userName?: string; token?: string; }
const cacheVersion = async (id: string) => {
  try { return (await redis.get(`messages:${id}:version`)) || "1"; }
  catch { return `${Date.now()}`; }
};
const invalidateMessages = async (id: string) => {
  try { await redis.incr(`messages:${id}:version`); } catch { /* TTL backup */ }
};
let io: SocketIOServer;
export const getIO = (): SocketIOServer => io;
// Socket.IO's adapter is the authoritative presence source. Redis single-socket
// hashes are incorrect for users with multiple tabs/servers (the last disconnect
// could erase another tab's presence). fetchSockets works across Redis adapter nodes.
export const isUserOnline = async (id: string) => {
  try { return Boolean(io && (await io.in(`user:${id}`).fetchSockets()).length); }
  catch { return false; }
};
export const getSocketIdForUser = async (id: string) => {
  try { return io && (await io.in(`user:${id}`).fetchSockets())[0]?.id || null; }
  catch { return null; }
};
const safeBounds = (input: unknown, max: number, fallback: number) => {
  const count = Number(input ?? fallback);
  if (!Number.isSafeInteger(count) || count < 1 || count > max) throw new AppError("Invalid pagination", 400);
  return count;
};
const onError = (socket: AuthSocket, error: unknown) => {
  const message = error instanceof AppError ? error.message : "Request could not be completed";
  socket.emit("socket:error", { message });
};
const personal = (id: string) => `user:${id}`;
const room = (id: string) => `conversation:${id}`;

const setUpSocketIO = (server: Server) => {
  io = new SocketIOServer(server, {
    cors: { origin: [...allowedOrigins], credentials: true, methods: ["GET", "POST"] },
    allowRequest: (req, callback) => callback(null, isAllowedOrigin(req.headers.origin)),
    transports: ["websocket", "polling"],
    // Redis Pub/Sub adapter cannot replay missed packets; use client REST resync after reconnect.
    ...(process.env.SOCKET_REDIS_ADAPTER !== "true" ? {
      connectionStateRecovery: { maxDisconnectionDuration: 2 * 60 * 1000, skipMiddlewares: false },
    } : {}),
    maxHttpBufferSize: 64 * 1024,
  });
  // Opt in to horizontal fanout only after a real shared Redis deployment is configured.
  // The adapter broadcasts rooms across instances; disconnect errors do not stop HTTP.
  if (process.env.SOCKET_REDIS_ADAPTER === "true") {
    const pub = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT || 6379),
      password: process.env.REDIS_PASSWORD || undefined,
      db: Number(process.env.REDIS_DB || 0),
    });
    const sub = pub.duplicate();
    pub.on("error", () => undefined);
    sub.on("error", () => undefined);
    io.adapter(createAdapter(pub, sub));
  }
  io.use(async (socket: AuthSocket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (typeof token !== "string") throw new AppError("Authentication required", 401);
      const user = await verifyAccess(token);
      socket.userId = user._id;
      socket.userName = user.name;
      socket.token = token;
      next();
    } catch { next(new Error("Authentication failed")); }
  });
  io.on("connection", async (socket: AuthSocket) => {
    const userId = socket.userId!;
    socket.join(personal(userId));
    // Revocation and role changes take effect on the next socket event as well.
    socket.use(async (_packet, next) => {
      try { await verifyAccess(socket.token!); next(); }
      catch { socket.emit("socket:error", { message: "Session expired. Please sign in again." }); socket.disconnect(true); }
    });
    try { await redis.del(`user:lastSeen:${userId}`); }
    catch { /* presence is independent of Redis storage */ }

    socket.on("conversations:get", async (data?: { search?: string }) => {
      try {
        let list = await conversationService.getUserConversationsService(userId);
        if (typeof data?.search === "string" && data.search.trim()) {
          const query = data.search.trim().toLowerCase().slice(0, 100);
          list = list.filter((c: any) => c.participants.some((p: any) => p?.name?.toLowerCase().includes(query)));
        }
        socket.emit("conversations:loaded", { conversations: list });
      } catch (error) { onError(socket, error); }
    });
    socket.on("conversation:join", async (data?: { conversationId?: string }) => {
      try {
        const id = data?.conversationId;
        if (!id) throw new AppError("Invalid conversation", 400);
        await conversationService.ensureParticipant(id, userId);
        socket.join(room(id));
      } catch (error) { onError(socket, error); }
    });
    socket.on("conversation:leave", (data?: { conversationId?: string }) => {
      if (typeof data?.conversationId === "string") socket.leave(room(data.conversationId));
    });
    socket.on("messages:get", async (data?: { conversationId: string; page?: number; limit?: number }) => {
      try {
        const id = data?.conversationId;
        if (!id) throw new AppError("Invalid conversation", 400);
        // Always check membership BEFORE reading any shared Redis cache.
        await conversationService.ensureParticipant(id, userId);
        const page = safeBounds(data?.page, 10000, 1);
        const limit = safeBounds(data?.limit, 50, 20);
        const key = `messages:${id}:v${await cacheVersion(id)}:p${page}:l${limit}`;
        let payload: any;
        try { const cached = await redis.get(key); if (cached) payload = JSON.parse(cached); }
        catch { /* DB is the source of truth */ }
        if (!payload) {
          const result = await messageServices.getAllMessagesService(id, userId, { page, limit });
          payload = { ...result, conversationId: id };
          try { await redis.setex(key, 45, JSON.stringify(payload)); } catch { /* optional cache */ }
        }
        socket.emit("messages:loaded", payload);
      } catch (error) { onError(socket, error); }
    });
    socket.on("message:send", async (data?: { conversationId: string; receiverId: string; content?: string; attachments?: string[] }) => {
      try {
        if (!data) throw new AppError("Missing message", 400);
        const message = await messageServices.createMessageService({ ...data, senderId: userId });
        await invalidateMessages(data.conversationId);
        io.to(room(data.conversationId)).to(personal(userId)).to(personal(data.receiverId))
          .emit("message:new", { message });
        const [senderConversations, receiverConversations] = await Promise.all([
          conversationService.getUserConversationsService(userId),
          conversationService.getUserConversationsService(data.receiverId),
        ]);
        io.to(personal(userId)).emit("conversations:loaded", { conversations: senderConversations });
        io.to(personal(data.receiverId)).emit("conversations:loaded", { conversations: receiverConversations });
        if (!(await isUserOnline(data.receiverId))) {
          try {
            const notification = await notifications.createNotification({ title: `New message from ${socket.userName || "Someone"}`,
              link: "/job-seeker/messages", sender: userId, receiver: data.receiverId });
            io.to(personal(data.receiverId)).emit("notification:new", { notification });
          } catch { /* message has already been saved */ }
        }
      } catch (error) { onError(socket, error); }
    });
    socket.on("message:edit", async (data?: { messageId: string; content: string; conversationId?: string }) => {
      try {
        if (!data) throw new AppError("Missing message", 400);
        const message = await messageServices.editMessageService(data.messageId, data.content, userId);
        const actualId = message.conversationId.toString();
        if (data.conversationId && data.conversationId !== actualId) throw new AppError("Conversation mismatch", 400);
        await invalidateMessages(actualId);
        io.to(room(actualId)).emit("message:edited", { message });
      } catch (error) { onError(socket, error); }
    });
    socket.on("message:delete", async (data?: { messageId: string; conversationId?: string }) => {
      try {
        if (!data) throw new AppError("Missing message", 400);
        const message = await messageServices.deleteMessageService(data.messageId, userId);
        const actualId = message.conversationId.toString();
        await invalidateMessages(actualId);
        io.to(room(actualId)).emit("message:deleted", { messageId: data.messageId });
      } catch (error) { onError(socket, error); }
    });
    socket.on("message:read", async (data?: { messageId: string; conversationId?: string }) => {
      try {
        if (!data) throw new AppError("Missing message", 400);
        const message = await messageServices.markMessageAsReadService(data.messageId, userId);
        const actualId = message.conversationId.toString();
        await invalidateMessages(actualId);
        io.to(room(actualId)).emit("message:read", { messageId: data.messageId, isRead: true });
      } catch (error) { onError(socket, error); }
    });
    socket.on("notifications:get", async (data?: { page?: number; limit?: number }) => {
      try {
        const page = safeBounds(data?.page, 10000, 1);
        const limit = safeBounds(data?.limit, 50, 10);
        const result = await notifications.getUserNotifications(userId, page, limit);
        socket.emit("notifications:loaded", { notifications: result.notifications,
          meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } });
      } catch (error) { onError(socket, error); }
    });
    socket.on("notification:read", async (data?: { notificationId: string }) => {
      try {
        if (!data) throw new AppError("Missing notification", 400);
        const updated = await notifications.markAsRead(data.notificationId, userId);
        if (updated) socket.emit("notification:updated", { notification: updated });
      } catch (error) { onError(socket, error); }
    });
    socket.on("notification:readAll", async () => {
      try { await notifications.markAllAsRead(userId); socket.emit("notifications:allRead"); }
      catch (error) { onError(socket, error); }
    });
    socket.on("notification:delete", async (data?: { notificationId: string }) => {
      try {
        if (!data) throw new AppError("Missing notification", 400);
        await notifications.deleteNotification(data.notificationId, userId);
        socket.emit("notification:deleted", { notificationId: data.notificationId });
      } catch (error) { onError(socket, error); }
    });
    socket.on("disconnect", async () => {
      try {
        // A different browser tab or server instance may still be connected.
        if (!(await isUserOnline(userId))) {
          await redis.set(`user:lastSeen:${userId}`, String(Date.now()), "EX", 86400);
        }
      } catch { /* transient presence/cache failure */ }
    });
  });
  return io;
};
export default setUpSocketIO;
