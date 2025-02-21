import { prisma } from "@devcord/node-prisma"
import { MessageWithSenderAndAttachments } from "@devcord/node-prisma/dist/types/message.types"

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


