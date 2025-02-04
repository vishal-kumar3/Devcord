import { Server, Socket } from "socket.io";
import { consumeMessage, produceMessage } from "./services/kafka.service.js";
import { setUserStatus } from "./config/redis.config.js";
import { AddMembersData, MessageData, RemoveMembersData, SOCKET_EVENTS, TitleChangeData, TypingData } from "@devcord/node-prisma/dist/constants/socket.const.js"

export interface CustomSocket extends Socket {
  room?: string
}

export const setupSocket = (io: Server) => {
  io.use((socket: CustomSocket, next) => {
    const room = socket.handshake.auth.room || socket.handshake.headers.room;
    if (!room) {
      return next(new Error("Invalid room"));
    }
    socket.room = room;
    consumeMessage("chat", room, socket);
    return next();
  });

  io.on(SOCKET_EVENTS.CONNECTION, (socket: CustomSocket) => {
    socket.join(socket.room);
    console.log("The socket is connected:- ", socket.id);

    // online offline idle status
    setUserStatus(socket.id, "idle");


    socket.on(SOCKET_EVENTS.MESSAGE, (data: MessageData) => {
      produceMessage("chat", socket.room, data);
    });

    socket.on(SOCKET_EVENTS.TITLE_CHANGE, (data: TitleChangeData) => {
      io.to(socket.room).emit(SOCKET_EVENTS.TITLE_CHANGE, data);
    })

    socket.on(SOCKET_EVENTS.REMOVE_MEMBERS, (data: RemoveMembersData) => {
      console.log("Remove members:- ", data)
      io.to(socket.room).emit(SOCKET_EVENTS.REMOVE_MEMBERS, data)
    })

    socket.on(SOCKET_EVENTS.ADD_MEMBERS, (data: AddMembersData) => {
      console.log("Add members:- ", data)
      io.to(socket.room).emit(SOCKET_EVENTS.ADD_MEMBERS, data)
    })

    socket.on(SOCKET_EVENTS.TYPING, (data: TypingData) => {
      socket.to(socket.room).emit(SOCKET_EVENTS.TYPING, data);
    })

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      setUserStatus(socket.id, "offline");
      console.log("A user disconnected:- ", socket.id);
    });
  });
};
