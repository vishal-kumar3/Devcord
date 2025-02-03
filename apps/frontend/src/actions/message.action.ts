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

export const getNextCombinedMessage = async (senderId: string, createdAt: Date) => {
  // WIP: Logic glt h
  const msg_duration = new Date(createdAt.getTime() + 10 * 60 * 1000)

  const message = await prisma.message.findFirst({
    where: {
      prevSender: senderId,
      prevCreatedAt: {
        gte: msg_duration,
        lte: createdAt
      }
    }
  }).catch((e) => {
    console.error("Error while fetching next combined message", e.stack)
    return null
  })

  if(!message) return null

  return message
}
