import { Prisma, Reaction } from "@prisma/client"

export type MessageWithSenderAndAttachments = Prisma.MessageGetPayload<{
  include: {
    sender: true,
    attachment: true
    reactions: true
  }
}>

export type NativeEmoji = {
  id: string
  shortcodes: string
  name: string
  native: string
}

export type ReactConversationMessage = {
  conversationId: string
  messageId: string
  msg: MessageWithSenderAndAttachments
}
