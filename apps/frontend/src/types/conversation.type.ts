import { Prisma } from "@prisma/client";

// export const ConversationWithUsers = Prisma.validator(
//   prisma,
//   'conversation',
//   'findUnique',
//   'include'
// )({ users: true })

// export type ConversationWithMembers = Prisma.validator<Prisma.ConversationDefaultArgs>()({
//   include: {
//     users: true
//   }
// })

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
