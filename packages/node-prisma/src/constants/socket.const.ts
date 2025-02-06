import { User } from "@prisma/client"
import { UserConversationWithUser } from "../types/conversation.types"

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
}
