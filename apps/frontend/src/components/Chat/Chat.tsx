"use client"
import { useEffect, useRef, useState } from "react"
import { setSocketMetadata } from "../../lib/socket.config"
import ChatHeader from "./ChatHeader"
import Message from "../Message/Message"
import { MembersList } from "./MembersList"
import { cn } from "../../lib/cn"
import { User } from "@prisma/client"
import { MessageData, RemoveMembersData, SOCKET_CONVERSATION } from "@devcord/node-prisma/dist/constants/socket.const.js"
import { SendMessageInput } from "../MessageInput/SendMessageInput"
import { useSocket } from "@/providers/socket.provider"
import { ConversationWithMembers } from "@devcord/node-prisma/dist/types/conversation.types"
import { MessageWithSenderAndAttachments } from "@devcord/node-prisma/dist/types/message.types"
import { useRouter } from "next/navigation"
import { checkMembership } from "@/actions/userConversation.action"

export type TypingEvent = {
  user: User
  conversationId: string
  typing: boolean
}

const Chat = (
  {
    conversation,
    currentUser,
    chat_message
  }
    :
    {
      currentUser: User,
      conversation: ConversationWithMembers,
      chat_message: MessageWithSenderAndAttachments[]
    }
) => {
  const [chat, setChat] = useState<MessageWithSenderAndAttachments[]>(chat_message || [])
  const [showMembersList, setShowMembersList] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket()
  const router = useRouter()

  const handleMessageSend = async (data: MessageData) => {
    if (!socket) return { error: "Socket not connected", success: false }
    // WIP: Store this in redis and update when user added or leaves or removed.
    const membership = await checkMembership(currentUser.id, conversation.id)

    if (!membership) return { error: "You are not a member of this conversation", success: false }

    socket.emit(SOCKET_CONVERSATION.MESSAGE, data)

    return { success: true, error: null }
  }

  useEffect(() => {
    if (!socket) return
    socket.connect()
    setSocketMetadata(socket, { room: conversation.id })

    const handleMessage = (data: MessageWithSenderAndAttachments) => {
      if (data.conversationId === conversation.id) setChat((prevChat) => [...prevChat, data])
    }

    const handleRemoveMembers = (data: RemoveMembersData) => {
      if (data.conversationId === conversation.id && data.members.includes(currentUser.id)) {
        router.replace("/p")
      }
    }

    socket.on(SOCKET_CONVERSATION.REMOVE_MEMBERS, handleRemoveMembers)
    socket.on(SOCKET_CONVERSATION.MESSAGE, handleMessage)

    return () => {
      socket.off(SOCKET_CONVERSATION.MESSAGE, handleMessage)
      socket.off(SOCKET_CONVERSATION.REMOVE_MEMBERS, handleRemoveMembers)
    }
  }, [conversation.id, socket, currentUser.id, router])

  useEffect(() => {
    // WIP: Scroll only when user sends msg not when recieves -> just show down arrow you recieved number of msg
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <div
      className={cn(
        "grid h-[100vh] grid-rows-[50px,1fr,auto] bg-back-three transition-all duration-300 overflow-hidden",
        showMembersList ? "grid-cols-[1fr,270px]" : "grid-cols-[1fr,0px]"
      )}
      style={{ gridTemplateAreas: "'header header' 'main aside' 'footer footer'" }}
    >
      <header
        style={{ gridArea: "header" }}
      >
        <ChatHeader loggedUser={currentUser} conversationDetails={conversation} setShowMembersList={setShowMembersList} />
      </header>
      <aside
        className={cn(
          "bg-back-two transition-all duration-300",
          showMembersList ? "translate-x-0 visible" : "translate-x-full collapse"
        )}
        style={{ gridArea: "aside" }}
      >
        <MembersList conversationId={conversation.id} membersList={conversation.users} />
      </aside>
      <main
        className="overflow-y-auto flex flex-col"
        style={{ gridArea: "main" }}
        ref={chatContainerRef}
      >
        <div className="w-full flex-1 min-h-[50px]"></div>
        {
          chat.map((msg: MessageWithSenderAndAttachments, index) => {
            return (
              <Message key={index} message={msg} />
            )
          })
        }
      </main>
      <SendMessageInput currentUser={currentUser} conversationId={conversation.id} handleMessageSend={handleMessageSend} />
    </div>
  )
}


export default Chat
