"use server"

import { prisma } from "@devcord/node-prisma"

export const checkMembership = async (userId: string, conversationId: string) => {
  if(!userId || !conversationId) return null

  const membership = await prisma.userConversation.findUnique({
    where: { userId_conversationId: { userId, conversationId } }
  }).catch(err => null)

  return membership
}
