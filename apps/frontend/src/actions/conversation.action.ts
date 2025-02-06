"use server"

import { prisma } from '@devcord/node-prisma';
import { getLoggedInUser } from "./user.action"
import { selectedUserType } from '@/components/HomePage/CreatePersonalConversation';
import { getAuthUser } from './auth.action';


export const createDmConversation = async ({ user }: { user: selectedUserType[] }) => {

  if (user.length == 0 || user.length > 10) return null

  const loggedInUser = await getLoggedInUser()
  if (!loggedInUser) return null

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
      name: name,
      type: isPersonal ? 'DM' : 'GROUP_DM',
      users: {
        createMany: {
          data: convUser
        }
      },
      admins: {
        connect: {
          id: loggedInUser.id
        }
      }
    }
  }).catch(err => {
    console.error("Error while creating conversation:- ", err.stack)
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
  { conversationId, users, totalMembers }
    :
    { conversationId: string, users: selectedUserType[], totalMembers: number }
) => {

  if (!conversationId || users.length == 0) return null
  const loggedInUser = await getLoggedInUser()
  if (!loggedInUser) return null

  // WIP: Check for authority if they can add members or not
  const conversation = await prisma.conversation.update({
    where: {
      id: conversationId
    },
    data: {
      users: {
        createMany: {
          data: users.map((user) => {
            return { userId: user.id }
          })
        }
      },
      isPersonal: totalMembers <= 2
    },
    include: {
      users: true
    }
  }).catch(err => {
    console.error("Error while fetching conversation", err.stack)
    return null
  })

  if (!conversation) return null

  const addedUser = await prisma.userConversation.findMany({
    where: {
      conversationId: conversationId,
      userId: {
        in: users.map((user) => user.id)
      }
    },
    include: {
      user: true
    }
  })

  return addedUser
}

export const removeMemberFromConversation = async (
  { conversationId, userId }
    :
    { conversationId: string, userId: string }
) => {
  if (!conversationId || !userId) return null

  const loggedInUser = await getLoggedInUser()
  if (!loggedInUser) return null

  const conversation = await prisma.conversation.update({
    where: {
      id: conversationId
    },
    data: {
      users: {
        deleteMany: {
          userId
        }
      }
    },
    include: {
      users: true
    }
  }).catch(err => {
    console.error("Error while removing member from conversation", err.stack)
    return null
  })

  return conversation?.users
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

export const getConversationByUserIdsInDM = async (userIds: string[]) => {
  if (!userIds) return null
  const session = await getAuthUser()
  if (!session) return null

  userIds.push(session.user.id)

  const conversations = await prisma.conversation.findMany({
    where: {
      isDM: true,
      users: {
        every: {
          userId: {
            in: userIds,
          }
        }
      },
      AND: [
        {
          users: {
            some: {
              userId: {
                in: userIds,
              },
            },
          },
        },
      ],
    },
  }).catch(err => {
    console.error("Error while fetching conversation by user ids", err.stack);
    return null;
  });

  return conversations
}
