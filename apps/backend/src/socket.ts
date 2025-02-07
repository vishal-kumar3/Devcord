import { Server, Socket } from "socket.io";
import { consumeMessage, produceMessage } from "./services/kafka.service.js";
import { setUserStatus } from "./config/redis.config.js";
import {
  AddMembersData,
  createDmConversationData,
  MessageData,
  RemoveMembersData,
  Rooms,
  SOCKET_EVENTS,
  TitleChangeData,
  TypingData,
  UserStatusType
} from "@devcord/node-prisma/dist/constants/socket.const.js"
import { handleFriendEvents } from "./events/friend.event.js";

export interface CustomSocket extends Socket {
  room?: string
  userId?: string
}

export const setupSocket = (io: Server) => {
  io.use((socket: CustomSocket, next) => {
    const room = socket.handshake.auth.room || socket.handshake.headers.room;
    const userId = socket.handshake.auth.userId || socket.handshake.headers.userId || null;

    // if (!room) {
    //   return next(new Error("Invalid room"));
    // }
    
    socket.room = room;
    socket.userId = userId;
    consumeMessage("chat", room, socket);
    return next();
  });

  io.on(SOCKET_EVENTS.CONNECTION, (socket: CustomSocket) => {
    console.log("The socket is connected:- ", socket.id);
    socket.join(socket.room);
    socket.join(socket.userId);
    socket.join(Rooms.USER_STATUS)

    handleFriendEvents(socket, io);

    // online offline idle status
    // WIP: use socket.userId if not working
    setUserStatus(socket.userId, UserStatusType.IDLE);

    // Message
    socket.on(SOCKET_EVENTS.MESSAGE, (data: MessageData) => {
      produceMessage("chat", socket.room, data);
    });

    // Chat title change
    socket.on(SOCKET_EVENTS.TITLE_CHANGE, (data: TitleChangeData) => {
      io.to(socket.room).emit(SOCKET_EVENTS.TITLE_CHANGE, data);
    })

    // remove members
    socket.on(SOCKET_EVENTS.REMOVE_MEMBERS, (data: RemoveMembersData) => {
      io.to(socket.room).emit(SOCKET_EVENTS.REMOVE_MEMBERS, data)
    })

    // add members
    socket.on(SOCKET_EVENTS.ADD_MEMBERS, (data: AddMembersData) => {
      io.to(socket.room).emit(SOCKET_EVENTS.ADD_MEMBERS, data)
    })

    // WIP: work on createDmConversation real-time
    socket.on(SOCKET_EVENTS.CREATE_CONVERSATION, (data: createDmConversationData) => {
      data.userIds.forEach((userId) => {
        socket.to(userId).emit(SOCKET_EVENTS.CREATE_CONVERSATION, data);
      })
    })

    // Typing
    socket.on(SOCKET_EVENTS.TYPING, (data: TypingData) => {
      socket.to(socket.room).emit(SOCKET_EVENTS.TYPING, data);
    })

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      setUserStatus(socket.userId, UserStatusType.OFFLINE);
      console.log("A user disconnected:- ", socket.id);
    });
  });
};
