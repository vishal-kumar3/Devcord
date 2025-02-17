"use server"

import { prisma } from "@devcord/node-prisma"
import { getAuthUser } from "./auth.action"
import { FriendRequestStatus } from "@prisma/client"
import { Session } from "next-auth"

export const sendFriendRequest = async (username: string) => {
  const session = await getAuthUser()

  if (!session) return { data: null, error: "Not Authenticated" }

  const friendExists = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive"
      }
    }
  }).catch(e => null)

  if (!friendExists) return { data: null, error: `Please check the username: ${username}` }

  if (friendExists.id === session.user.id) return { data: null, error: "You can't send request to yourself" }

  const reverseRequestExists = await prisma.friendRequest.update({
    where: {
      requesterId_receiverId: {
        requesterId: friendExists.id,
        receiverId: session.user.id
      }
    },
    data: {
      status: "ACCEPTED"
    }
  }).catch(() => {
    return null
  })

  if (reverseRequestExists) return { data: reverseRequestExists, error: null }

  const request = await prisma.friendRequest.upsert({
    where: {
      requesterId_receiverId: {
        requesterId: session.user.id,
        receiverId: friendExists.id
      },
      NOT: {
        OR: [
          { status: "ACCEPTED" },
          // { status: "PENDING" }
        ]
      }
    },
    update: {
      status: "PENDING"
    },
    create: {
      requesterId: session.user.id,
      receiverId: friendExists.id,
      status: "PENDING"
    },
  }).catch(e => null)

  if (!request) return { data: null, error: "Already your friend" }


  return { data: request, error: null }
}

export const getSentRequests = async (session: Session) => {

  if (!session) {
    const trySession = await getAuthUser()
    if (!trySession) return { data: null, error: "User Unauthenticated" }
    session = trySession
  }

  const requests = await prisma.friendRequest.findMany({
    where: {
      requesterId: session.user.id,
      status: "PENDING"
    },
    include: {
      receiver: true
    }
  })
  return { data: requests, error: null }
}

export const getReceivedRequestById = async (requestId: string) => {
  const request = await prisma.friendRequest.findUnique({
    where: {
      id: requestId,
    },
    include: {
      requester: true
    }
  })

  return { data: request, error: null }
}

export const getReceivedRequests = async (session: Session) => {

  if (!session) {
    const trySession = await getAuthUser()
    if (!trySession) return { data: null, error: "User Unauthenticated" }
    session = trySession
  }

  const requests = await prisma.friendRequest.findMany({
    where: {
      receiverId: session.user.id,
      status: "PENDING"
    },
    include: {
      requester: true
    }
  })

  return { data: requests, error: null }
}

export const getSenderAndReceiverById = async (requestId: string) => {
  if (!requestId) return { data: null, error: "Invalid Request" }

  const request = await prisma.friendRequest.findUnique({
    where: { id: requestId },
    include: {
      requester: true,
      receiver: true,
    }
  }).catch(e => null)

  if (!request) return { data: null, error: "Request not found" }

  return { data: request, error: null }
}

export const deleteAcceptedRequests = async ({ friendId, status }: { friendId: string, status: FriendRequestStatus }) => {
  const session = await getAuthUser()

  if (!session) return { data: null, error: "User not found" }
  const request = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        {
          requesterId: friendId,
          receiverId: session.user.id,
          status: "ACCEPTED"
        },
        {
          requesterId: session.user.id,
          receiverId: friendId,
          status: "ACCEPTED"
        }
      ]
    }
  }).catch(e => null)

  if (!request) return { data: null, error: "Request not found" }

  const deletedRequest = await prisma.friendRequest.delete({
    where: {
      id: request.id
    }
  })

  if (!deletedRequest) return { data: null, error: "Failed to delete request" }

  return { data: deletedRequest, error: null }
}

export const updateReceivedFriendRequest = async ({ friendId, status }: { friendId: string, status: FriendRequestStatus }) => {
  const session = await getAuthUser()

  if (!session) return { data: null, error: "User not found" }

  const request = await prisma.friendRequest.findUnique({
    where: {
      requesterId_receiverId: {
        requesterId: friendId,
        receiverId: session.user.id
      }
    }
  }).catch(e => null)


  if (!request) return { data: null, error: "Request not found" }

  const updateRequest = await prisma.friendRequest.update({
    where: {
      id: request.id
    },
    data: {
      status: status
    },
    include: {
      requester: true,
      receiver: true
    }
  })

  return { data: updateRequest, error: null }
}

export const updateSentFriendRequest = async ({ friendId, status }: { friendId: string, status: FriendRequestStatus }) => {
  const session = await getAuthUser()

  if (!session) return { data: null, error: "User not found" }

  const request = await prisma.friendRequest.findUnique({
    where: {
      requesterId_receiverId: {
        requesterId: session.user.id,
        receiverId: friendId
      }
    }
  }).catch(e => null)


  if (!request) return { data: null, error: "Request not found" }

  const updateRequest = await prisma.friendRequest.update({
    where: {
      id: request.id
    },
    data: {
      status: status
    },
    include: {
      requester: true,
      receiver: true
    }
  })

  return { data: updateRequest, error: null }
}

export const getFriendsList = async (session?: Session) => {

  if (!session) {
    const trySession = await getAuthUser()
    if (!trySession) return null
    session = trySession
  }

  const friends = await prisma.friendRequest.findMany({
    where: {
      OR: [
        {
          receiverId: session.user.id
        },
        {
          requesterId: session.user.id
        }
      ],
      status: "ACCEPTED"
    },
    select: {
      id: true,
      requesterId: true,
      receiverId: true,
      requester: true,
      receiver: true,
    }
  }).catch(e => null)

  if (!friends) return null

  const filteredFriends = friends.map((friendRequest) => {
    if (friendRequest.receiverId === session.user.id) {
      return { id: friendRequest.id, user: friendRequest.requester };
    } else {
      return { id: friendRequest.id, user: friendRequest.receiver };
    }
  }).filter(Boolean);


  return filteredFriends
}

export const getFriendsListForDM = async (session?: Session) => {

  if (!session) {
    const trySession = await getAuthUser()
    if (!trySession) return null
    session = trySession
  }

  const friends = await prisma.friendRequest.findMany({
    where: {
      OR: [
        {
          receiverId: session.user.id
        },
        {
          requesterId: session.user.id
        }
      ],
      status: "ACCEPTED"
    },
    select: {
      requesterId: true,
      receiverId: true,
      requester: true,
      receiver: true,
    }
  }).catch(e => null)

  if (!friends) return null

  const filteredFriends = friends.map((friendRequest) => {
    if (friendRequest.receiverId === session.user.id) {
      return friendRequest.requester
    } else {
      return friendRequest.receiver
    }
  }).filter(Boolean);


  return filteredFriends
}
