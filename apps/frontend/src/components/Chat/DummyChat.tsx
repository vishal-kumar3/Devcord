"use client"
import { useEffect, useRef, useState } from "react"
import { getSocket, setSocketMetadata } from "../../lib/socket.config"
import ChatHeader from "./ChatHeader"
import Message from "./Message"
import { MembersList } from "./MembersList"
import { cn } from "../../lib/utils"
import { ConversationWithMembers } from "../../types/conversation.type"
import { MessageWithSender } from "@/types/message.types"
import { User } from "@prisma/client"
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

const DummyChat = (
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
    setSocketMetadata(socket, { userId: user.id, room: conversationId })

    const handleMessage = (data: MessageWithSender) => {
      setChat((prevChat) => [...prevChat, data])
    }

    socket.on(SOCKET_EVENTS.MESSAGE, handleMessage)

    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE, handleMessage)
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
        "flex h-[100vh] flex-col bg-back-three transition-all duration-300 overflow-hidden",
        showMembersList ? "open-sidebar" : "close-sidebar"
      )}
      style={{ gridTemplateAreas: "'header header' 'main aside' 'footer footer'" }}
    >
      <header
        className="h-[50px]"
        style={{ gridArea: "header" }}
      >
        <ChatHeader loggedUser={user} conversationDetails={conversation} setShowMembersList={setShowMembersList} />
      </header>
      <div className="">
        <main
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
        </main>
        <aside
          className={cn(
            "bg-back-two transition-all duration-300",
            showMembersList ? "translate-x-0 visible" : "translate-x-full collapse"
          )}
          style={{ gridArea: "aside" }}
        >
          <MembersList conversationId={conversationId} membersList={conversation.users} />
        </aside>
      </div>
      <div className="h-[90px]">
        <SendMessageInput user={user} conversationId={conversationId} socket={socket} handleMessageSend={handleMessageSend} />
      </div>
    </div>
  )
}


export default DummyChat
