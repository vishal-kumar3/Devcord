"use client"

import { Conversation } from "@prisma/client"
import { useEffect, useState } from "react"
import { DMButton } from "./DmButton"
import { Session } from "next-auth"
import { useSocket } from "@/providers/socket.provider"
import { SOCKET_CONVERSATION } from "@devcord/node-prisma/dist/constants/socket.const"

export const ConversationList = ({ conversations, session }: { conversations: Conversation[], session: Session }) => {
  const [conversation, setConversation] = useState<Conversation[]>(conversations)
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    const handleAddConversation = (data: Conversation) => {
      setConversation([...conversation, data])
    }

    socket.on(SOCKET_CONVERSATION.CREATE_CONVERSATION, handleAddConversation)

    return () => {
      socket.off(SOCKET_CONVERSATION.CREATE_CONVERSATION, handleAddConversation)
    }
  })


  return (
    <>
      {
        conversation.map(conversation => (
          <DMButton
            conversation={conversation}
            key={conversation.id}
            session={session}
          />
        ))
      }
    </>
  )
}
