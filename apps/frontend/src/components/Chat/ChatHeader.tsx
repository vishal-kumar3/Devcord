import Image from "next/image"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ConversationWithMembers } from "../../types/conversation.type"
import { User } from "@prisma/client"
import { ChangeConversationName } from "../../actions/conversation.action"
import { cn } from "@/lib/utils"
import { getSocket, setSocketMetadata } from "@/lib/socket.config"
import { SOCKET_EVENTS, TitleChangeData } from "@devcord/node-prisma/dist/constants/socket.const"

// WIP: Members icon will not appear in personal chat
// WIP: Send grp message declaring the grp name changed + by whom
// WIP: conversationName ka kuch krna hoga like when name is changed and if it still have the name of any user then it will be removed and the user will se empty grp name.

const ChatHeader = (
  { setShowMembersList, conversationDetails, loggedUser }
    :
  {
    setShowMembersList: Dispatch<SetStateAction<boolean>>,
    conversationDetails: ConversationWithMembers,
    loggedUser: User
  }) => {

  let name = conversationDetails.name?.replace(loggedUser.username as string, "") as string
  const [inputValue, setInputValue] = useState(name);

  const socket = getSocket()

  useEffect(() => {
    socket.connect()
    setSocketMetadata(socket, { room: conversationDetails.id })

    const handleTitleChange = (data: TitleChangeData) => {
      if (data.conversationId !== conversationDetails.id) return
      setInputValue(data.title)
    }

    socket.on(SOCKET_EVENTS.TITLE_CHANGE, handleTitleChange)

    return () => {
      socket.off(SOCKET_EVENTS.TITLE_CHANGE, handleTitleChange)
      socket.disconnect()
    }
  }, [socket, conversationDetails.id])



  return (
    <div className="flex justify-between items-center px-4 border-b border-divider bg-back-three min-h-nav">
      <div className="flex items-center gap-2">
        <div className="size-[40px] bg-black rounded-full"></div>
        {/* <p className="font-semibold">{conversationDetails.name?.replace(loggedUser.username, "")}</p> */}
        <input
          type="text"
          className={cn(
            "border border-transparent focus:border-black bg-transparent outline-none flexibleInput min-w-[2ch] py-0.5 overflow-hidden whitespace-nowrap resize-none",
          )}
          value={inputValue}
          disabled={conversationDetails.isPersonal}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={async (e) => {
            if (e.target.value === name) return
            const conversation = await ChangeConversationName(conversationDetails.id, e.target.value as string)
            if (conversation) {
              name = e.target.value
              socket.emit(SOCKET_EVENTS.TITLE_CHANGE, {
                conversationId: conversation.id,
                title: conversation.name
              } as TitleChangeData)
            }
            if (!conversation) {
              e.target.value = name
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

export const Icon = ({icon, action}: {icon: string, action?: () => void}) => {
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
