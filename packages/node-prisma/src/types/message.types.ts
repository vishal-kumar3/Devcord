import { Prisma } from "@prisma/client"

export type MessageWithSenderAndAttachments = Prisma.MessageGetPayload<{
  include: {
    sender: true,
    attachment: true
  }
}>
