import { Prisma } from "@prisma/client";



export type FriendRequestWithSenderAndReceiver = Prisma.FriendRequestGetPayload<{
  include: {
    requester: true
    receiver: true
  }
}>

export type FriendRequestSentWithReceiver = Prisma.FriendRequestGetPayload<{
  include: {
    receiver: true
  }
}>



export type FriendRequestReceiveWithSender = Prisma.FriendRequestGetPayload<{
  include: {
    requester: true
  }
}>
