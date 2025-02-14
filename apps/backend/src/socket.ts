import { Server, Socket } from "socket.io";
import { consumeMessage } from "./services/kafka.service.js";
import {
  SOCKET_EVENTS,
} from "@devcord/node-prisma/dist/constants/socket.const.js"
import { handleFriendEvents } from "./events/friend.socket.js";
import { handleConversationEvents } from "./events/chat.event.js";

export interface CustomSocket extends Socket {
  room?: string
  userId?: string
}

export const setupSocket = (io: Server) => {
  io.use((socket: CustomSocket, next) => {
    const room = socket.handshake.auth.room || socket.handshake.headers.room;
    const userId = socket.handshake.query.userId as string | null;

    if (!userId) {
      return next(new Error("Missing userId"));
    }

    // if (!room) {
      //   return next(new Error("Invalid room"));
    // }
    socket.room = room;
    socket.userId = userId;
    return next();
  });

  io.on(SOCKET_EVENTS.CONNECTION, (socket: CustomSocket) => {
    if (socket.room) {
      consumeMessage("chat", socket.room, socket);
      socket.join(socket.room);
    }
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
