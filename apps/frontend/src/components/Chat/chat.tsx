"use client"

import { useEffect, useState } from "react"
import { getSocket } from "../../lib/socket.config"
import { User } from "@prisma/client"
import ChatHeader from "./ChatHeader"
import Message from "./Message"
import { MembersList } from "./MembersList"
import { cn } from "../../lib/utils"
import { ConversationWithMembers } from "../../types/conversation.type"
import { MessageWithSender } from "@/types/message.types"

export type ChatMsg = {
  msg: string
  user: User
  conversationId: string
}

const Chat = (
  { conversationId, conversation, user, chat_message }
    :
    {
      conversationId: string,
      user: User,
      conversation: ConversationWithMembers,
      chat_message: MessageWithSender[] | null
    }) => {

  const [chat, setChat] = useState<MessageWithSender[]>(chat_message || [])
  const [showMembersList, setShowMembersList] = useState(false)

  const socket = getSocket()

  useEffect(() => {
    socket.connect()
    socket.auth = {
      room: conversationId
    }

    const handleMessage = (data: MessageWithSender) => {
      console.log("Socket msg is", data)
      setChat((prevChat) => [...prevChat, data])
    }

    socket.on("message", handleMessage)

    return () => {
      socket.off("message", handleMessage)
      socket.disconnect()
    }
  }, [conversationId, socket])


  return (
    <div className="flex flex-col h-screen bg-back-three">
      <ChatHeader loggedUser={user} conversationDetails={conversation} setShowMembersList={setShowMembersList} />
      <div className="flex flex-row h-full">
        <div className="flex-1 flex flex-col justify-end p-4 gap-2">
          {chat.map((msg, index) => {
            return (
              <Message key={index} message={msg} />
            )
          })}
        </div>
        <div className={cn(
          "min-w-64 rounded-l-lg bg-back-two transition-transform duration-300",
          showMembersList ? "translate-x-0" : "translate-x-full"
        )}>
          <MembersList membersList={conversation.users} />
        </div>
      </div>
      <form
        className="p-4 flex gap-2"
        action={(data) => {
          const msg = data.get("msg") as string
          if (msg) {
            const send = { msg: msg, user: user, conversationId } as ChatMsg
            socket.emit("message", send)
          }
      }}>
        <input
          className="flex-1 p-2 px-3 rounded-md outline-none border-none"
          placeholder="Type a message"
          type="text"
          name="msg"
          autoComplete="off"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default Chat
