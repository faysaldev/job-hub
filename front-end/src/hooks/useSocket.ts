"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "@/src/redux/features/auth/authSlice";
import { initSocket, getSocket } from "@/src/lib/socket";
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
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      setSocket(null);
      return;
    }
    const s = initSocket(token);
    setSocket(s);
  }, [token]);

  return socket ?? getSocket();
}
