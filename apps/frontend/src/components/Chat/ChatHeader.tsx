import Image from "next/image"
import { Dispatch, SetStateAction } from "react"

// WIP: Members icon will not appear in personal chat

const ChatHeader = (
  { setShowMembersList }:
    {
      setShowMembersList: Dispatch<SetStateAction<boolean>>

  }) => {

  return (
    <div className="flex justify-between items-center px-4 border-b border-divider bg-back-three min-h-nav">
      <div className="flex items-center gap-2">
        <div className="size-[40px] bg-black rounded-full"></div>
        <p className="font-semibold">This is title</p>
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

const Icon = ({icon, action}: {icon: string, action?: () => void}) => {
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
