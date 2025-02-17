import { AddMembersData, createDmConversationData, MessageData, RemoveMembersData, SOCKET_CONVERSATION, SOCKET_EVENTS, TitleChangeData, TypingData } from "@devcord/node-prisma/dist/constants/socket.const.js";
import { CustomSocket } from "../socket.js";
import { Server } from "socket.io";
import { consumeMessage, produceMessage } from "../services/kafka.service.js";
import { ConversationWithUsers } from "@devcord/node-prisma/dist/types/userConversation.types.js";
import { Conversation } from "@prisma/client";


export const handleConversationEvents = (socket: CustomSocket, io: Server) => {
  // Message
  socket.on(SOCKET_CONVERSATION.MESSAGE, (data: MessageData) => {
    produceMessage("chat", data.conversationId, data);
  });

  // Typing
  socket.on(SOCKET_CONVERSATION.TYPING, (data: TypingData) => {
    socket.to(data.conversationId).emit(SOCKET_CONVERSATION.TYPING, data);
  });

  // Chat title change
  socket.on(SOCKET_CONVERSATION.TITLE_CHANGE, (data: TitleChangeData) => {
    io.to(data.conversationId).emit(SOCKET_CONVERSATION.TITLE_CHANGE, data);
  })

  // Add members
  socket.on(SOCKET_CONVERSATION.ADD_MEMBERS, (data: AddMembersData) => {
    io.to([...data.members.map(user => user.userId), data.conversationId]).emit(SOCKET_CONVERSATION.ADD_MEMBERS, data);
  });

  // Remove members
  socket.on(SOCKET_CONVERSATION.REMOVE_MEMBERS, (data: RemoveMembersData) => {
    io.to(data.conversationId).emit(SOCKET_CONVERSATION.REMOVE_MEMBERS, data);
  });

  socket.on(SOCKET_CONVERSATION.JOIN_CONVERSATION, (conversationId: string) => {
    socket.join(conversationId);
    consumeMessage("chat", conversationId, socket);
  })

  // Create conversation
  socket.on(SOCKET_CONVERSATION.CREATE_CONVERSATION, (data: ConversationWithUsers) => {
    const sendData: Conversation = data
    io.to(data.users.map(user => user.userId)).emit(SOCKET_CONVERSATION.CREATE_CONVERSATION, sendData);
  });
}
