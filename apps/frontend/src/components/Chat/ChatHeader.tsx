import Image from "next/image"


const ChatHeader = () => {
  return (
    <div className="flex justify-between items-center px-4 border-b border-divider bg-back-three h-nav">
      <div className="flex items-center gap-2">
        <div className="size-[40px] bg-black rounded-full"></div>
        <p className="font-semibold">This is title</p>
      </div>
      <div className="flex items-center gap-2">
        <Icon icon="Call" />
        <Icon icon="Video Call" />
        <Icon icon="Pin" />
        <Icon icon="Members" />
      </div>
    </div>
  )
}

export default ChatHeader

const Icon = ({icon}: {icon: string}) => {
  return (
    <Image
      src={`/icons/${icon}.svg`}
      className="cursor-pointer"
      alt="Search"
      width={30}
      height={30}
    />
  )
}
