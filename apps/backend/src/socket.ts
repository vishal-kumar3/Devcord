import { Server, Socket } from "socket.io";
import {
  SOCKET_EVENTS,
} from "@devcord/node-prisma/constants/socket.const.js"
import { handleFriendEvents } from "./events/friend.socket.js";
import { handleConversationEvents } from "./events/chat.event.js";

export interface CustomSocket extends Socket {
  userId?: string
}

export const setupSocket = (io: Server) => {
  io.use((socket: CustomSocket, next) => {
    // const room = socket.handshake.auth.room || socket.handshake.headers.room;
    const userId = socket.handshake.query.userId as string | null;

    if (!userId) {
      return next(new Error("Missing userId"));
    }

    socket.userId = userId;
    return next();
  });

  io.on(SOCKET_EVENTS.CONNECTION, (socket: CustomSocket) => {
    socket.join(socket.userId);

    // socket.join(Rooms.USER_STATUS)

    handleFriendEvents(socket, io);
    handleConversationEvents(socket, io);

    // online offline idle status
    // WIP: use socket.userId if not working
    // setUserStatus(socket.userId, UserStatusType.IDLE);

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      // setUserStatus(socket.userId, UserStatusType.OFFLINE);
      console.log("A user disconnected:- ", socket.id);
    });
  });
};
