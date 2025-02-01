import { cn } from "@/lib/utils"
import { MessageWithSender } from "@/types/message.types"
import { formatDate, formatTime } from "@/utils/date_time"
import Image from "next/image"


const Message = ({ message }: { message: MessageWithSender }) => {
  const combined_msg = message.prevSender == message.senderId

  return (
    <div className={cn(
      "relative flex group px-4 gap-4 hover:bg-back-two transition-colors ease-in-out duration-200",
      combined_msg ? null : "mt-4 pt-1"
    )}>
      <div className={cn(
        "rounded-full overflow-hidden",
        combined_msg ? "w-[40px]" : "size-[40px]"
      )}>
        {
          combined_msg ? null : (
            <Image
              src={message.sender?.image || "/images/avatar.png"}
              className="rounded-full cursor-pointer"
              alt="avatar"
              width={40}
              height={40}
            />
          )
        }
      </div>
      <div>
        <div className="flex gap-3 items-center">
          {
            combined_msg ? null : (
              <>
                <div className="text-text text-message-username font-semibold hover:underline cursor-pointer">
                  {message.sender?.name}
                </div>
                <div className="text-message-time text-text-muted">
                  {formatDate(message.updatedAt)}
                </div>
              </>
            )
          }
        </div>
        <div className="relative group flex items-center">
          {
            combined_msg && (
              <div className="absolute -left-[50px] group-hover:opacity-100 opacity-0 text-message-time text-text-description">{formatTime(message.createdAt)}</div>
            )
          }
          {message.content}
        </div>
      </div>
      <ReactionButtons />
    </div>
  )
}

export const ReactionButtons = ({ }) => {

  return (
    <div className="absolute -top-3 right-4 bg-back-one w-[200px] h-[20px] group-hover:opacity-100 opacity-0 transition-opacity duration-150 rounded-md flex justify-evenly items-center">
      <button className="text-white">👍</button>
      <button className="text-white">❤️</button>
      <button className="text-white">🔥</button>
    </div>
  )
}

export const ReactionButton = ({ emoji }: { emoji: string }) => {
  return (
    <button className="">{emoji}</button>
  )
}


export default Message
