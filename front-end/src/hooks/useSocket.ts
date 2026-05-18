"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "@/src/redux/features/auth/authSlice";
import { initSocket, getSocket, disconnectSocket } from "@/src/lib/socket";
import type { Socket } from "socket.io-client";

/**
 * React hook that ensures the socket is initialised with the current auth
 * token and returns the live Socket instance.
 *
 * Safe to call in multiple components simultaneously — the underlying
 * singleton is only created once.
 */
export function useSocket(): Socket | null {
  const token = useSelector(selectToken);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;
    const s = initSocket(token);
    socketRef.current = s;
    return () => {
      // Do not disconnect on every unmount; socket is shared app-wide.
    };
  }, [token]);

  return socketRef.current ?? getSocket();
}
