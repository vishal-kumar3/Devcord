import { FriendRequest, User } from "@prisma/client"
import { UserConversationWithUser } from "../types/userConversation.types"

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
  attachments?: AttachmentData[]
}

export type AttachmentData = {
  id: string
  fileName: string
  size: number
  url: string
  proxyUrl?: string
  width: number
  height: number
  contentType: string
  title?: string
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
}

export const SOCKET_FRIEND = {
  SEND: "send-friend-request",
  RECEIVE: "receive-friend-request",
  ACCEPT: "accept-friend-request",
  DECLINE: "decline-friend-request",
  WITHDRAW: "withdraw-friend-request",
  REMOVE: "remove-friend-request",
}

export const SOCKET_USER_STATUS = {
  ONLINE: "status-online",
  OFFLINE: "status-offline",
  IDLE: "status-idle"
}

export const SOCKET_CONVERSATION = {
  MESSAGE: "message-conversation",
  TYPING: "typing-conversation",
  TITLE_CHANGE: "title-change-conversation",
  ADD_MEMBERS: "add-members-conversation",
  REMOVE_MEMBERS: "remove-members-conversation",
  CREATE_CONVERSATION: "create-conversation",
  JOIN_CONVERSATION: "join-conversation",
}
