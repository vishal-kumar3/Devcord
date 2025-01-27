import Image from "next/image"
import { Dispatch, SetStateAction, useState } from "react"
import { ConversationWithMembers } from "../../types/conversation.type"
import { User } from "@prisma/client"
import { ChangeConversationName } from "../../actions/conversation.action"

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

  const name = conversationDetails.name?.replace(loggedUser.username, "") as string

  return (
    <div className="flex justify-between items-center px-4 border-b border-divider bg-back-three min-h-nav">
      <div className="flex items-center gap-2">
        <div className="size-[40px] bg-black rounded-full"></div>
        {/* <p className="font-semibold">{conversationDetails.name?.replace(loggedUser.username, "")}</p> */}
        <input
          type="text"
          defaultValue={name}
          onBlur={async (e) => {
            console.log("wah")
            if (e.target.value === name) return
            const conversation = await ChangeConversationName(conversationDetails.id, e.target.value as string)
            if (!conversation) {
              e.target.value = name
            }
            console.log("conversation", conversation)
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
