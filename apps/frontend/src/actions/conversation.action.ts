"use server"

import { prisma } from "../db/prisma"
import { getLoggedInUser } from "./user.action"


export const createConversation = async ({ user }: { user: { id: string, username: string }[] }) => {

  if (user.length == 0) return null
  if (user.length > 10) return null

  const loggedInUser = await getLoggedInUser()
  if(!loggedInUser) return null
  user.push({ id: loggedInUser?.id, username: loggedInUser?.username })

  const isPersonal = user.length == 2
  let name = ''
  const convUser = user.map((user) => {
    name += loggedInUser.username !== user.username ? ` ${user.username} ` : ''
    return { userId: user.id }
  })

  name.trim()
  name.replace(' ', ', ')

  const conversation = await prisma.conversation.create({
    data: {
      isPersonal,
      name: name,
      users: {
        createMany: {
          data: convUser
        }
      }
    }
  }).catch(err => {
    console.error("Error while creating conversation:- ",err.stack)
    return null
  })

  return conversation
}

export const getConversationByUserId = async (userId: string) => {
  if (!userId) {
    const user = await getLoggedInUser()
    userId = user?.id as string
  }

  if(!userId) return null

  const conversation = await prisma.conversation.findMany({
    where: {
      users: {
        some: {
          userId
        }
      }
    }
  }).catch(err => {
    console.error("Error while fetching conversation by user id", err.stack)
    return null
  })

  return conversation
}

export const getConversationById = async (conversationId: string) => {
  if(!conversationId) return null

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId
    }
  }).catch(err => {
    console.error("Error while fetching conversation by id", err.stack)
    return null
  })

  return conversation
}
