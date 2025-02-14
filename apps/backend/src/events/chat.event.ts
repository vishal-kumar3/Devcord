import { AddMembersData, createDmConversationData, MessageData, RemoveMembersData, SOCKET_CONVERSATION, SOCKET_EVENTS, TitleChangeData, TypingData } from "@devcord/node-prisma/dist/constants/socket.const.js";
import { CustomSocket } from "../socket.js";
import { Server } from "socket.io";
import { produceMessage } from "../services/kafka.service.js";
import { ConversationWithUsers } from "@devcord/node-prisma/dist/types/userConversation.types.js";
import { Conversation } from "@prisma/client";


export const handleConversationEvents = (socket: CustomSocket, io: Server) => {
  // Message
  socket.on(SOCKET_CONVERSATION.MESSAGE, (data: MessageData) => {
    produceMessage("chat", socket.room, data);
  });

  // Typing
  socket.on(SOCKET_CONVERSATION.TYPING, (data: TypingData) => {
    socket.to(socket.room).emit(SOCKET_CONVERSATION.TYPING, data);
  });

  // Chat title change
  socket.on(SOCKET_CONVERSATION.TITLE_CHANGE, (data: TitleChangeData) => {
    io.to(socket.room).emit(SOCKET_CONVERSATION.TITLE_CHANGE, data);
  })

  // Add members
  socket.on(SOCKET_CONVERSATION.ADD_MEMBERS, (data: AddMembersData) => {
    io.to(socket.room).emit(SOCKET_CONVERSATION.ADD_MEMBERS, data);
  });

  // Remove members
  socket.on(SOCKET_CONVERSATION.REMOVE_MEMBERS, (data: RemoveMembersData) => {
    io.to(socket.room).emit(SOCKET_CONVERSATION.REMOVE_MEMBERS, data);
  });

  // Create conversation
  socket.on(SOCKET_CONVERSATION.CREATE_CONVERSATION, (data: ConversationWithUsers) => {
    const sendData: Conversation = data
    io.to(data.users.map(user => user.userId)).emit(SOCKET_CONVERSATION.CREATE_CONVERSATION, sendData);
  });
}
