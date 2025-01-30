"use server"

import { prisma } from '@devcord/node-prisma';
import { getLoggedInUser } from "./user.action"


export const createConversation = async ({ user }: { user: { id: string, username: string }[] }) => {

  if (user.length == 0 || user.length > 10) return {
    error: "Invalid number of users",
    data: null
  }

  const loggedInUser = await getLoggedInUser()
  if (!loggedInUser) return { error: "User not logged in", data: null }

  user.push({
    id: loggedInUser?.id,
    username: loggedInUser?.username as string
  })

  const isPersonal = user.length == 2
  let name = ''
  const convUser = user.map((user) => {
    name += user.username + ' ';
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
    console.error("Error while creating conversation:- ", err.stack)
    return { error: "Error while creating conversation", data: null }
  })

  return { data: conversation, error: null }
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

export const AddMembersToConversation = async (
  { conversationId, users }
    :
    { conversationId: string, users: { id: string, username: string }[] }) => {
  if (!conversationId || users.length == 0) return null

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId
    }
  }).catch(err => {
    console.error("Error while fetching conversation", err.stack)
    return null
  })

  if (!conversation) return null

  const loggedInUser = await getLoggedInUser()
  if (!loggedInUser) return null

  const convUser = users.map((user) => {
    return { userId: user.id }
  })

  const newUsers = await prisma.conversation.update({
    where: {
      id: conversationId
    },
    data: {
      users: {
        createMany: {
          data: convUser
        }
      }
    }
  }).catch(err => {
    console.error("Error while adding members to conversation", err.stack)
    return null
  })

  return newUsers
}

export const getConversationAndUserById = async (conversationId: string) => {
  if (!conversationId) return {error: "Invalid conversation id", data: null}

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId
    },
    include: {
      users: {
        include: {
          user: true
        }
      }
    }
  }).catch(err => {
    console.error("Error while fetching conversation by id", err.stack)
    return {error: "Error while fetching conversation by id", data: null}
  })

  return {data: {conversation}, error: null}
}
