"use client";

/**
 * SocketProvider
 * Mounts once at the app root (inside ReduxProvider so it can access the
 * Redux token). Keeps the socket connection alive for the entire session.
 * Individual components call useSocket() to get the same singleton.
 */
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "@/src/redux/features/auth/authSlice";
import { initSocket, disconnectSocket } from "@/src/lib/socket";

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const token = useSelector(selectToken);

  useEffect(() => {
    if (token) {
      initSocket(token);
    } else {
      // User logged out — clean up the socket
      disconnectSocket();
    }
  }, [token]);

  return <>{children}</>;
};

export default SocketProvider;
