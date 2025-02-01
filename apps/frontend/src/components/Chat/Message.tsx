import { MessageWithSender } from "@/types/message.types"
import Image from "next/image"


const Message = ({ message }: { message: MessageWithSender }) => {
  return (
    <div className="flex gap-2">
      <div className="size-[30px] rounded-full overflow-hidden">
        <Image
          src={message.sender?.image || "/images/avatar.png"}
          alt="avatar"
          width={30}
          height={30}
        />
      </div>
      <div>
        <div className="flex gap-1">
          <div>{message.sender?.name}</div>
          <div>{(message.updatedAt).toString()}</div>
        </div>
        <div>{message.content}</div>
      </div>
    </div>
  )
}

export default Message
