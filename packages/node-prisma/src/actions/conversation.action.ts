import { prisma } from ".."

export const ChangeConversationName = async (conversationId: string, name: string) => {
  if (!conversationId || !name) return null

  const conversation = await prisma.conversation.update({
    where: {
      id: conversationId
    },
    data: {
      name
    }
  }).catch(err => {
    console.error("Error while updating conversation name", err.stack)
    return null
  })

  return conversation
}
