"use client"
import { getSocket } from "@/lib/socket.config";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}


const SocketContext = createContext<SocketContextType>(undefined!);

export function SocketProvider({ children }) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      const newSocket = getSocket(session.user.id);
      newSocket.connect();
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
    return () => {};
  }, [session]);

  return (
    <SocketContext.Provider value={{socket}}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
