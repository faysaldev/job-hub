/** Socket.IO singleton with authentication rotation and automatic room rejoin. */
import { io, Socket } from "socket.io-client";
let socket: Socket | null = null;
let activeToken = "";
const joinedRooms = new Set<string>();
const SOCKET_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

export function initSocket(token: string): Socket {
  const nextToken = token.replace(/['"]+/g, "");
  if (socket) {
    if (activeToken !== nextToken) {
      activeToken = nextToken;
      socket.auth = { token: nextToken };
      // Socket.IO does not renegotiate auth on an existing connection.
      socket.disconnect().connect();
    } else if (!socket.connected && !socket.active) {
      socket.connect();
    }
    return socket;
  }
  activeToken = nextToken;
  socket = io(SOCKET_URL, {
    auth: { token: nextToken },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    timeout: 20000,
  });
  // Track existing conversation subscriptions so token refreshes never silently
  // drop incoming messages after the socket reconnects.
  socket.onAnyOutgoing((event, data) => {
    if (event === "conversation:join" && typeof data?.conversationId === "string") {
      joinedRooms.add(data.conversationId);
    }
    if (event === "conversation:leave" && typeof data?.conversationId === "string") {
      joinedRooms.delete(data.conversationId);
    }
  });
  socket.on("connect", () => {
    for (const conversationId of joinedRooms) socket?.emit("conversation:join", { conversationId });
  });
  socket.on("connect_error", (error) => { console.warn("Socket authentication/connect failed:", error.message); });
  return socket;
}
export function getSocket(): Socket | null { return socket; }
export function disconnectSocket(): void {
  if (socket) { socket.removeAllListeners(); socket.disconnect(); socket = null; }
  joinedRooms.clear();
  activeToken = "";
}
