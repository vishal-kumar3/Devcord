import { Prisma } from "@prisma/client"

export type MessageWithSender = Prisma.MessageGetPayload<{
  include: {
    sender: true
  }
}>
