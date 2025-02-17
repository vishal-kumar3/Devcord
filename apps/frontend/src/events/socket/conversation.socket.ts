import { SOCKET_CONVERSATION } from "@devcord/node-prisma/dist/constants/socket.const";
import { ConversationWithUsers } from "@devcord/node-prisma/dist/types/userConversation.types";
import { Socket } from "socket.io-client";

export const CreateConversationEvent = (
  socket: Socket | null,
  data: ConversationWithUsers
) => {
  if (!socket) return
  socket.emit(SOCKET_CONVERSATION.CREATE_CONVERSATION, data)
}
