"use client"

import { useEffect, useRef, useState } from "react"
import { getSocket } from "../../lib/socket.config"
import ChatHeader from "./ChatHeader"
import Message from "./Message"
import { MembersList } from "./MembersList"
import { cn } from "../../lib/utils"
import { ConversationWithMembers } from "../../types/conversation.type"
import { MessageWithSender } from "@/types/message.types"
import { User } from "@prisma/client"
import { Socket } from "socket.io-client"
import Image from "next/image"
import { SOCKET_EVENTS } from "@devcord/node-prisma/dist/constants/socket.const.js"
import { SendMessageInput } from "./SendMessageInput"

export type ChatMsg = {
  msg: string
  user: User
  conversationId: string
  prevSender?: string
  prevCreatedAt?: Date
}

export type TypingEvent = {
  user: User
  conversationId: string
  typing: boolean
}

const Chat = (
  {
    conversationId,
    conversation,
    user,
    chat_message
  }
    :
    {
      conversationId: string,
      user: User,
      conversation: ConversationWithMembers,
      chat_message: MessageWithSender[]
    }
) => {

  const [chat, setChat] = useState<MessageWithSender[]>(chat_message || [])
  const [showMembersList, setShowMembersList] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [membersList, setMembersList] = useState<User>()


  const handleMessageSend = (data: FormData) => {
    const msg = data.get("msg") as string
    if (msg) {
      const send = {
        msg: msg,
        user: user,
        conversationId,
        prevSender: chat.length !== 0 ? chat.slice(-1)[0].senderId : null,
        prevCreatedAt: chat.length !== 0 ? chat.slice(-1)[0].createdAt : null
      } as ChatMsg
      socket.emit(SOCKET_EVENTS.MESSAGE, send)
    }
  }

  const socket = getSocket()

  useEffect(() => {
    socket.connect()
    socket.auth = {
      room: conversationId
    }

    const handleMessage = (data: MessageWithSender) => {
      setChat((prevChat) => [...prevChat, data])
    }

    socket.on(SOCKET_EVENTS.MESSAGE, handleMessage)

    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE, handleMessage)
      // socket.off(SOCKET_EVENTS.TYPING, handleTyping)
      socket.disconnect()
    }
  }, [conversationId, socket, user.id])

  useEffect(() => {
    // WIP: Scroll only when user sends msg not when recieves -> just show down arrow you recieved number of msg
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <div
      className={cn(
        "grid h-[100vh] grid-rows-[50px,auto,90px] bg-back-three transition-all duration-300 overflow-hidden",
        showMembersList ? "grid-cols-[1fr,270px]" : "grid-cols-[1fr,0px]"
      )}
      style={{ gridTemplateAreas: "'header header' 'main aside' 'footer footer'" }}
    >
      <header
        style={{ gridArea: "header" }}
      >
        <ChatHeader loggedUser={user} conversationDetails={conversation} setShowMembersList={setShowMembersList} />
      </header>
      <aside
        className={cn(
          "bg-back-two transition-all duration-300",
          showMembersList ? "translate-x-0 visible" : "translate-x-full collapse"
        )}
        style={{ gridArea: "aside" }}
      >
        <MembersList conversationId={conversationId}  membersList={conversation.users} />
      </aside>
      <div
        className="overflow-y-auto flex flex-col"
        style={{ gridArea: "main" }}
        ref={chatContainerRef}
      >
        <div className="w-full flex-1 min-h-[50px]"></div>
        {
          chat.map((msg: MessageWithSender, index) => {
            return (
              <Message key={index} message={msg} />
            )
          })
        }
      </div>
      <SendMessageInput user={user} conversationId={conversationId} socket={socket} handleMessageSend={handleMessageSend} />
    </div>
  )
}


export default Chat
