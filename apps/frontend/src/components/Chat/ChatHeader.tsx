import Image from "next/image"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { User } from "@prisma/client"
import { ChangeConversationName } from "../../actions/conversation.action"
import { cn } from "@/lib/cn"
import { setSocketMetadata } from "@/lib/socket.config"
import { SOCKET_CONVERSATION, TitleChangeData } from "@devcord/node-prisma/dist/constants/socket.const"
import { useSocket } from "@/providers/socket.provider"
import { showConversationName } from "@/utils/conversation"
import { ConversationWithMembers } from "@devcord/node-prisma/dist/types/conversation.types"


// WIP: Send system message declaring the grp name changed + by whom
// WIP: fix the name when input is empty

const ChatHeader = (
  { setShowMembersList, conversationDetails, loggedUser }
    :
    {
      setShowMembersList: Dispatch<SetStateAction<boolean>>,
      conversationDetails: ConversationWithMembers,
      loggedUser: User
    }) => {
  const [name, setName] = useState<string>(showConversationName(conversationDetails.name, conversationDetails.nameEdited, loggedUser.username))
  const [inputValue, setInputValue] = useState<string>(name);

  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return
    socket.connect()
    setSocketMetadata(socket, { room: conversationDetails.id })

    const handleTitleChange = (data: TitleChangeData) => {
      if (data.conversationId !== conversationDetails.id) return
      setInputValue(data.title)
    }

    socket.on(SOCKET_CONVERSATION.TITLE_CHANGE, handleTitleChange)

    return () => {
      socket.off(SOCKET_CONVERSATION.TITLE_CHANGE, handleTitleChange)
    }
  }, [socket, conversationDetails.id])



  return (
    <div className="flex justify-between items-center px-4 border-b border-divider bg-back-three min-h-nav">
      <div className="flex items-center gap-2">
        <div className="size-[40px] bg-black rounded-full"></div>
        <input
          type="text"
          className={cn(
            "border border-transparent focus:border-black font-semibold text-white/70 bg-transparent outline-none flexibleInput min-w-[2ch] py-0.5 overflow-hidden whitespace-nowrap resize-none",
          )}
          value={inputValue}
          disabled={conversationDetails.type === "DM"}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={async (e) => {
            setInputValue(inputValue.trim())
            if (e.target.value.trim() === "") {
              return setInputValue(name)
            }
            if (e.target.value.trim() === name) return

            const conversation = await ChangeConversationName(conversationDetails.id, e.target.value.trim() as string)

            if (conversation) {
              setName(e.target.value.trim())
              socket?.emit(SOCKET_CONVERSATION.TITLE_CHANGE, {
                conversationId: conversation.id,
                title: conversation.name
              } as TitleChangeData)
            }
            if (!conversation) {
              e.target.value = name.trim()
            }
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <Icon icon="Call" />
        <Icon icon="Video Call" />
        <Icon icon="Pin" />
        <Icon icon="Members" action={() => setShowMembersList(prev => !prev)} />
      </div>
    </div>
  )
}

export default ChatHeader

export const Icon = ({ icon, action }: { icon: string, action?: () => void }) => {
  return (
    <Image
      src={`/icons/${icon}.svg`}
      className="cursor-pointer"
      alt="Search"
      width={30}
      height={30}
      onClick={action}
    />
  )
}
