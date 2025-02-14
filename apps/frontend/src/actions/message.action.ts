import { prisma } from "@devcord/node-prisma"
import { MessageWithSender } from "@devcord/node-prisma/dist/types/message.types"

export const getMessageByConversationId = async (conversationId: string) => {

  const messages: MessageWithSender[] | null = await prisma.message.findMany({
    where: {
      conversationId
    },
    include: {
      sender: true
    }
  }).catch((e) => {
    console.log("Error while fetching messages", e.stack)
    return null
  })

  return messages
}
