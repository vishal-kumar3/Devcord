"use server"

import { prisma } from '@devcord/node-prisma';
import { getLoggedInUser } from "./user.action"
import { selectedUserType } from '@/components/HomePage/Dm';
import { getAuthUser } from './auth.action';
import { auth } from '@/auth';


export const createOrGetDMConversation = async (userId: string, username?: string) => {
  if (!userId) return { created: null, data: null, error: "Invalid data" }
  const session = await auth()
  if (!session) return { created: null, data: null, error: "User not authorised" }

  const existingConversation = await prisma.conversation.findFirst({
    where: {
      users: {
        every: {
          userId: {
            in: [userId, session.user.id]
          }
        }
      },
      type: 'DM'
    }
  }).catch(err => null)

  if (existingConversation) return { created: null, data: existingConversation, error: null }

  if (!username) {
    const user = await prisma.user.findUnique({ where: { id: userId } }).catch(err => null)
    if (!user) return { created: null, data: null, error: "User not found" }
    username = user?.username
  }

  const createConversation = await prisma.conversation.create({
    data: {
      name: session.user.username + ', ' + username,
      type: 'DM',
      users: {
        createMany: {
          data: [
            { userId: userId, isAdmin: false },
            { userId: session.user.id, isAdmin: false }
          ]
        }
      }
    },
    include: {
      users: true
    }
  }).catch(err => null)

  if (!createConversation) return { created: null, data: null, error: "Error while creating conversation" }

  return { created: createConversation, data: null, error: null }
}

export const getExistingConversationByUserIds = async (userIds: string[]) => {
  if (!userIds || userIds.length == 0) return null
  const session = await getAuthUser()
  if (!session) return null

  userIds.push(session.user.id)

  const conversations = await prisma.conversation.findMany({
    where: {
      users: {
        every: {
          userId: { in: userIds }
        }
      }
    },
    include: {
      users: true
    }
  });

  // Filter out conversations that have more or fewer users than provided userIds
  return conversations.filter(conversation =>
    conversation.users.length === userIds.length
  );
}

export const createDMConversation = async ({ user }: { user: selectedUserType[] }) => {

  if (user.length == 0 || user.length > 10) return null

  const loggedInUser = await getLoggedInUser()
  if (!loggedInUser) return null

  user.push({
    id: loggedInUser?.id,
    username: loggedInUser?.username as string
  })

  const isPersonal = user.length <= 2

  const name: string[] = []
  const convUser = user.map((user) => {
    name.push(user.username)
    return { userId: user.id, isAdmin: loggedInUser.id === user.id }
  })

  const conversation = await prisma.conversation.create({
    data: {
      name: name.join(', '),
      type: isPersonal ? 'DM' : 'GROUP_DM',
      users: {
        createMany: {
          data: convUser
        }
      },
    },
    include: {
      users: true
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

  if (!userId) return null

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
  if (!conversationId) return null

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
      name,
      nameEdited: new Date(),
    }
  }).catch(err => {
    console.error("Error while updating conversation name", err.stack)
    return null
  })

  return {id: conversation?.id ,name: conversation?.name}
}

export const AddMembersToConversation = async (
  { conversationId, users }
    :
    { conversationId: string, users: selectedUserType[] }
) => {
  if (!conversationId || users.length == 0) return { created: null, data: null, error: "Invalid data" }

  const loggedInUser = await getLoggedInUser()
  if (!loggedInUser) return { created: null, data: null, error: "User not authorised" }

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId
    },
    select: {
      id: true,
      type: true,
      users: {
        select: {
          user: {
            select: {
              id: true,
              username: true
            }
          }
        }
      }
    }
  }).catch(err => null)

  if (!conversation) return { created: null, data: null, error: "Conversation not found" }

  if (conversation.type === 'DM') {
    const members = conversation.users
      .filter(user => user.user.id !== loggedInUser.id)
      .map(user => ({
        id: user.user.id,
        username: user.user.username
      }));
    const newConversation = await createDMConversation({user: [...users,...members]})
    if (!newConversation) return { created: null, data: null, error: "Error while creating conversation" }
    return { created: newConversation, data: null, error: null }
  }

  // WIP: Check for authority if they can add members or not
  const updatedConversation = await prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      users: {
        createMany: {
          data: users.map((user) => {
            return { userId: user.id, isAdmin: loggedInUser.id === user.id }
          })
        }
      },
    },
    include: {
      users: {
        include: {
          user: true
        }
      }
    }
  }).catch(err => {
    console.error("Error while fetching conversation", err.stack)
    return null
  })

  if (!updatedConversation) return { created: null, data: null, error: "Error while adding user" }

  const addedUser = updatedConversation.users.filter((user) => {
    return users.some((u) => u.id == user.userId)
  })

  updatedConversation.users = addedUser

  return { created: null, data: updatedConversation, error: null }
}

export const removeMemberFromConversation = async (
  { conversationId, userId }
    :
    { conversationId: string, userId: string }
) => {
  if (!conversationId || !userId) return { data: null, error: "Invalid data" }

  const loggedInUser = await getLoggedInUser()
  if (!loggedInUser) return { data: null, error: "User not authorised" }

  if (loggedInUser.id === userId) return { data: null, error: "You can't remove yourself" }

  const conversation = await prisma.conversation.update({
    where: {
      id: conversationId,
      users: {
        some: {
          userId: loggedInUser.id,
          isAdmin: true
        }
      }
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
    return null
  })

  if (!conversation) return { data: null, error: "Error while removing user" }

  return { data: conversation.users, error: null }
}

export const getConversationAndUserById = async (conversationId: string) => {
  if (!conversationId) return { error: "Invalid conversation id", data: null }

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
    return { error: "Error while fetching conversation by id", data: null }
  })

  return { data: { conversation }, error: null }
}

export const getConversationByUserIdsInDM = async (userIds: string[]) => {
  if (!userIds) return null
  const session = await getAuthUser()
  if (!session) return null

  userIds.push(session.user.id)

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { type: "DM" },
        { type: "GROUP_DM" }
      ],
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
