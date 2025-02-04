import { Prisma } from "@prisma/client";

export type UserConversationWithUser = Prisma.UserConversationGetPayload<{
  include: {
    user: true
  }
}>
