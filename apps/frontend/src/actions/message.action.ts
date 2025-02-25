"use server"
import { prisma } from "@devcord/node-prisma"
import { MessageWithSenderAndAttachments } from "@devcord/node-prisma/dist/types/message.types"
import { getAuthUser } from "./auth.action"

export const getMessageByConversationId = async (conversationId: string) => {
  const messages: MessageWithSenderAndAttachments[] | null = await prisma.message.findMany({
    where: {
      conversationId
    },
    include: {
      sender: true,
      attachment: true
    }
  }).catch((e) => {
    return null
  })

  return messages
}

export const deleteMessage = async (messageId: string) => {
  const session = await getAuthUser()
  if (!session?.user) return { error: "User not found", messageId: null }


  const message = await prisma.message.delete({
    where: {
      id: messageId,
      senderId: session.user.id
    }
  }).catch(err => null)

  if (!message) return { error: "Message not found", messageId: null }

  return { messageId, error: null }
}
