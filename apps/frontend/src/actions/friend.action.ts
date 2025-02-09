"use server"

import { prisma } from "@devcord/node-prisma"
import { getAuthUser } from "./auth.action"
import { FriendRequestStatus, User } from "@prisma/client"
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
      }
    },
    update: {},
    create: {
      requesterId: session.user.id,
      receiverId: friendExists.id,
      status: "PENDING"
    },
  })

  if (!request) return { data: null, error: "Error sending request" }

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

  console.log(request)

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

  console.log(request)

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
      requesterId: true,
      receiverId: true,
      requester: true,
      receiver: true,
    }
  }).catch(e => null)

  if (!friends) return null

  const filteredFriends = friends.map((friendRequest) => {
    if (friendRequest.receiverId === session.user.id) {
      return friendRequest.requester;
    } else {
      return friendRequest.receiver;
    }
  }).filter(Boolean);


  return filteredFriends
}

export const getPendingRequests = async (session: Session) => {

  if (!session) {
    const trySession = await getAuthUser()
    if (!trySession) return { data: null, error: "User Unauthenticated" }
    session = trySession
  }

  const requests = await prisma.friendRequest.findMany({
    where: {
      OR: [
        {
          receiverId: session.user.id
        },
        {
          requesterId: session.user.id
        }
      ],
      status: "PENDING"
    },
    include: {
      requester: true,
      receiver: true
    }
  })

  return { data: requests, error: null }
}
