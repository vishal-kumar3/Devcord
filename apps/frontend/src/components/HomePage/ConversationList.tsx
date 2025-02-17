"use client"

import { Conversation } from "@prisma/client"
import { useEffect, useState } from "react"
import { DMButton } from "./DmButton"
import { Session } from "next-auth"
import { useSocket } from "@/providers/socket.provider"
import { AddMembersData, RemoveMembersData, SOCKET_CONVERSATION } from "@devcord/node-prisma/dist/constants/socket.const"
import { getConversationById } from "@/actions/conversation.action"
import { useParams } from "next/navigation"

export const ConversationList = ({ conversations, session }: { conversations: Conversation[], session: Session }) => {
  const [conversation, setConversation] = useState<Conversation[]>(conversations)
  const { socket } = useSocket()
  const ActiveConversation = useParams<{ conversationId: string }>().conversationId ?? null

  useEffect(() => {
    if (!socket) return

    const handleAddConversation = (data: Conversation) => {
      if(!conversation.some(conv => conv.id === data.id)) setConversation([...conversation, data])
    }

    const handleRemoveConversation = (data: RemoveMembersData) => {
      if (data.members.includes(session.user.id)) {
        setConversation(conversation.filter(c => c.id !== data.conversationId))
      }
    }

    const handleAddMembers = async (data: AddMembersData) => {
      console.log("Added this user:- ", data)
      if (data.members.some(userConv => userConv.userId === session.user.id)) {
        const addedConverastion = await getConversationById(data.conversationId)
        if (!addedConverastion) return

        setConversation(prev =>
          prev.some(conv => conv.id === addedConverastion.id)
            ? prev
            : [...prev, addedConverastion]
        );

      }
    }

    socket.on(SOCKET_CONVERSATION.ADD_MEMBERS, handleAddMembers)
    socket.on(SOCKET_CONVERSATION.REMOVE_MEMBERS, handleRemoveConversation)
    socket.on(SOCKET_CONVERSATION.CREATE_CONVERSATION, handleAddConversation)

    return () => {
      socket.off(SOCKET_CONVERSATION.ADD_MEMBERS, handleAddMembers)
      socket.off(SOCKET_CONVERSATION.REMOVE_MEMBERS, handleRemoveConversation)
      socket.off(SOCKET_CONVERSATION.CREATE_CONVERSATION, handleAddConversation)
    }
  })


  return (
    <>
      {
        conversation.map(conversation => (
          <DMButton
            active={ActiveConversation === conversation.id}
            conversation={conversation}
            key={conversation.id}
            session={session}
          />
        ))
      }
    </>
  )
}
