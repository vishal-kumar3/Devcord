import { FriendRequest, User } from "@prisma/client"
import { UserConversationWithUser } from "../types/conversation.types"
import { FriendRequestWithSenderAndReceiver } from "../types/friend.types"

export type TitleChangeData = {
  conversationId: string
  title: string
}

export type TypingData = {
  user: User
  conversationId: string
  typing: boolean
}

export type MessageData = {
  msg: string
  user: User
  conversationId: string
  prevSender?: string
  prevCreatedAt?: Date
}

export type AddMembersData = {
  conversationId: string
  members: UserConversationWithUser[]
}

export type RemoveMembersData = {
  conversationId: string
  members: string[]
}

// WIP: work on createDmConversation real-time, also have complete conversation
export type createDmConversationData = {
  userIds: string[]
  conversationId: string
}

export type FriendRquestData = FriendRequest

export const UserStatusType = {
  ONLINE: "online",
  OFFLINE: "offline",
  IDLE: "idle"
}

export const Rooms = {
  USER_STATUS: "user-status"
}

export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  MESSAGE: "message",
  TYPING: "typing",
  TITLE_CHANGE: "title-change",
  ADD_MEMBERS: "add-members",
  REMOVE_MEMBERS: "remove-members",
  CREATE_CONVERSATION: "create-conversation",
  SEND_FRIEND_REQUEST: "send-friend-request",
  RECEIVE_FRIEND_REQUEST: "receive-friend-request",
  DECLINE_FRIEND_REQUEST: "decline-friend-request",
  WITHDRAW_FRIEND_REQUEST: "withdraw-friend-request",
  ACCEPT_FRIEND_REQUEST: "accept-friend-request",
  REMOVE_FRIEND: "remove-friend",
}
