import { SOCKET_CONVERSATION } from "@devcord/node-prisma/dist/constants/socket.const";
import { Socket } from "socket.io-client";

export const CreateConversationType = {
  users: 
}

export const CreateConversationEvent = (socket: Socket | null, ) => {
  if (!socket) return

  socket.emit(SOCKET_CONVERSATION.CREATE_CONVERSATION, {})
}
