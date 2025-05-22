"use server"
import { prisma } from "@devcord/node-prisma"
import { MessageWithSenderAndAttachments, NativeEmoji } from "@devcord/node-prisma/dist/types/message.types"
import { getAuthUser } from "./auth.action"

export const getMessageByConversationId = async (conversationId: string) => {
  const messages: MessageWithSenderAndAttachments[] | null = await prisma.message.findMany({
    where: {
      conversationId
    },
    include: {
      sender: true,
      attachment: true,
      reactions: true
    },
    orderBy: {
      createdAt: "asc"
    }
  }).catch((e) => {
    return null
  })

  return messages
}

export const deleteMessage = async (messageId: string) => {
  const session = await getAuthUser()
  if (!session?.user) return { error: "User not found", messageId: null }


  const message = await prisma.message.delete({
    where: {
      id: messageId,
      senderId: session.user.id,
    }
  }).catch(err => null)

  if (!message) return { error: "Message not found", messageId: null }

  return { messageId, error: null }
}

export const editMessage = async (messageId: string, content: string, deleteAttachment: string[]) => {
  const session = await getAuthUser()
  if (!session?.user) return { error: "User not found", message: null }

  const message = await prisma.message.update({
    where: {
      id: messageId,
      senderId: session.user.id
    },
    data: {
      content,
      attachment: {
        deleteMany: {
          id: {
            in: deleteAttachment
          }
        }
      },
      editedAt: new Date()
    },
    include: {
      sender: true,
      attachment: true,
      reactions: true
    }
  }).catch(err => null)

  if (!message) return { error: "Message not found", message: null }

  return { message, error: null }
}

export const reactToMessage = async (messageId: string, reaction: NativeEmoji) => {
  const session = await getAuthUser()
  if (!session?.user) return { error: "User not found", messageId: null }

  const reactionExists = await prisma.reaction.findUnique({
    where: {
      messageId_emojiId: {
        messageId,
        emojiId: reaction.shortcodes
      },
    },
    include: {
      users: { select: { id: true } }
    }
  })

  if (!reactionExists) {
    const newReaction = await prisma.reaction.create({
      data: {
        messageId,
        emojiId: reaction.shortcodes,
        emojiName: reaction.name,
        emojiNative: reaction.native,
        users: {
          connect: { id: session.user.id }
        },
        count: 1
      }
    })

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { sender: true, attachment: true, reactions: true }
    }).catch(err => null)

    if (!newReaction) return { error: "Message not found", message: null }

    return { message, error: null }
  }

  const userReactionExists = reactionExists.users.some(user => user.id === session.user.id)

  if (userReactionExists) {
    if (reactionExists.count <= 1) {
      await prisma.reaction.delete({
        where: {
          messageId_emojiId: {
            messageId,
            emojiId: reaction.shortcodes
          }
        }
      })

      const message = await prisma.message.findUnique({
        where: { id: messageId },
        include: { sender: true, attachment: true, reactions: true }
      }).catch(err => null)

      if (!message) return { error: "Message not found", message: null }

      return { message, error: null }
    }

    const updatedReaction = await prisma.reaction.update({
      where: {
        messageId_emojiId: {
          messageId,
          emojiId: reaction.shortcodes
        }
      },
      data: {
        users: {
          disconnect: { id: session.user.id }
        },
        count: {
          decrement: 1
        }
      }
    })

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { sender: true, attachment: true, reactions: true }
    }).catch(err => null)

    if (!updatedReaction) return { error: "Message not found", message: null }

    return { message, error: null }
  }

  const updatedReaction = await prisma.reaction.update({
    where: {
      messageId_emojiId: {
        messageId,
        emojiId: reaction.shortcodes
      }
    },
    data: {
      users: {
        connect: { id: session.user.id }
      },
      count: {
        increment: 1
      }
    }
  })

  if (!updatedReaction) return { error: "Message not found", message: null }

  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: { sender: true, attachment: true, reactions: true }
  }).catch(err => null)

  return { message, error: null }
}
