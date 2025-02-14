"use client"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useEffect, useState } from "react"
import { setSocketMetadata } from "@/lib/socket.config"
import { SOCKET_CONVERSATION, TitleChangeData } from "@devcord/node-prisma/dist/constants/socket.const"
import { useSocket } from "@/providers/socket.provider"
import { Conversation } from "@prisma/client"
import { showConversationName } from "@/utils/conversation"
import { Session } from "next-auth"
import { Tooltip, TooltipContent, TooltipProvider } from "../ui/tooltip"
import { TooltipTrigger } from "@radix-ui/react-tooltip"

type DMButtonProps = {
  conversation: Conversation
  session: Session
}

export const DMButton = ({ conversation, session }: DMButtonProps) => {
  const [dmName, setDmName] = useState<string>(conversation.name || "")
  const { socket } = useSocket()

  useEffect(() => {
    if (!conversation.id || !socket) return
    setSocketMetadata(socket, { room: conversation.id })

    const handleTitleChange = (data: TitleChangeData) => {
      const title = data.title
      const cId = data.conversationId
      conversation.nameEdited = new Date()
      if (cId !== conversation.id) return
      setDmName(title)
    }

    socket.on(SOCKET_CONVERSATION.TITLE_CHANGE, handleTitleChange)

    return () => {
      socket.off(SOCKET_CONVERSATION.TITLE_CHANGE, handleTitleChange)
    }
  })


  return (
    <Link href={`/p/user/${conversation.id}`} className="py-1 px-3 flex justify-between items-center rounded-lg hover:bg-white hover:bg-opacity-10 text-neutral-400 hover:text-neutral-300 font-semibold text-base transition-all ease-in">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-1 items-center gap-2">
              <Avatar
                className="size-[40px]"
              >
                <AvatarImage src={""} alt={''} />
                <AvatarFallback>{''}</AvatarFallback>
              </Avatar>
              <div className="line-clamp-1">{showConversationName(dmName, conversation?.nameEdited, session.user.username)}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {showConversationName(dmName, conversation?.nameEdited, session.user.username)}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* <button className="min-w-[20px] min-h-[20px] flex justify-center items-center rounded-full bg-neutral-800 bg-opacity-70 hover:bg-neutral-700 hover:bg-opacity-70">
        <Image src="/icons/Close.svg" className="text-green-500" alt="x" width={20} height={20} />
      </button> */}
    </Link>
  )
}
