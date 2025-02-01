import { MessageWithSender } from "@/types/message.types"
import { prisma } from "@devcord/node-prisma"


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
