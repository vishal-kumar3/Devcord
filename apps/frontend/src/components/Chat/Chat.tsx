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

export type ChatMsg = {
  msg: string
  user: User
  conversationId: string
  prevSender?: string
  prevCreatedAt?: Date
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
      chat_message: MessageWithSender[] | null
    }
) => {

  const [chat, setChat] = useState<MessageWithSender[]>(chat_message || [])
  const [showMembersList, setShowMembersList] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const socket = getSocket()

  useEffect(() => {
    socket.connect()
    socket.auth = {
      room: conversationId
    }

    const handleMessage = (data: MessageWithSender) => {
      setChat((prevChat) => [...prevChat, data])
    }

    socket.on("message", handleMessage)

    return () => {
      socket.off("message", handleMessage)
      socket.disconnect()
    }
  }, [conversationId, socket])

  useEffect(() => {
    // WIP: Scroll only when user sends msg not when recieves -> just show down arrow you recieved number of msg
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <div
      className={cn(
        "grid h-[100vh] grid-rows-[50px,auto,70px] bg-back-three transition-all duration-300 overflow-hidden",
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
        <MembersList membersList={conversation.users} />
      </aside>
      <div
        className="overflow-y-auto flex flex-col"
        style={{ gridArea: "main" }}
        ref={chatContainerRef}
      >
        <div className="w-full flex-1"></div>
        {
          chat.map((msg, index) => {
            return (
              <Message key={index} message={msg} />
            )
          })
        }
      </div>
      <footer
        style={{ gridArea: "footer" }}
      >
        <form
          className="p-4 flex gap-2"
          action={(data) => {
            const msg = data.get("msg") as string
            if (msg) {
              const send = {
                msg: msg,
                user: user,
                conversationId,
                prevSender: chat.length !== 0 ? chat.slice(-1)[0].senderId : null,
                prevCreatedAt: chat.length !== 0 ? chat.slice(-1)[0].createdAt : null
              } as ChatMsg
              socket.emit("message", send)
            }
          }}>
          <input
            className="flex-1 p-2 px-3 rounded-md outline-none border-none"
            placeholder="Type a message"
            type="text"
            name="msg"
            autoComplete="off"
            autoFocus
          />
          <button type="submit">Send</button>
        </form>
      </footer>
    </div>
  )
}

export default Chat
