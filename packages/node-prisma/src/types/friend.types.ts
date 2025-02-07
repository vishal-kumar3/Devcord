import { Prisma } from "@prisma/client";



export type FriendRequestWithSenderAndReceiver = Prisma.FriendRequestGetPayload<{
  include: {
    requester: true
    receiver: true
  }
}>
