import { Prisma } from "@prisma/client";

export type ConversationWithMembers = Prisma.ConversationGetPayload<{
  include: {
    users: {
      include: {
        user: true
      }
    }
  }
}>

export type ConversationWithUsers = Prisma.ConversationGetPayload<{
  include: {
    users: true
  }
}>
