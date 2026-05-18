/**
 * Socket.IO singleton manager.
 * Keeps ONE socket instance for the lifetime of the browser session.
 * Initialise by calling `initSocket(token)` after the user logs in;
 * destroy with `disconnectSocket()` on logout.
 */

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const SOCKET_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export function initSocket(token: string): Socket {
  if (socket && socket.connected) return socket;

  const cleanToken = token.replace(/['"]+/g, "");

  socket = io(SOCKET_URL, {
    auth: { token: cleanToken },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    timeout: 20000,
  });

  socket.on("connect", () => {
    console.log("[Socket] Connected:", socket?.id);
  });

  socket.on("connect_error", (err) => {
    console.warn("[Socket] Connection error:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket] Disconnected:", reason);
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
