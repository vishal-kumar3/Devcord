import { cn } from "@/lib/utils"
import { MessageWithSender } from "@/types/message.types"
import { formatDate, formatTime } from "@/utils/date_time"
import Image from "next/image"


// WIP: ensure that kafka is sending data correctly since createAt is not recognised as Date else as string which is major bug

const Message = ({ message }: { message: MessageWithSender }) => {
  const createdAtDate = new Date(message.createdAt);
  const prevCreatedAtDate = message.prevCreatedAt ? new Date(message.prevCreatedAt) : null;

  const duration_diff = (createdAtDate.getTime() - (prevCreatedAtDate?.getTime() ?? 0)) / (1000 * 60);

  const combine = (message.prevSender == message.senderId) && duration_diff < 10;

  return (
    <div className={cn(
      "relative flex group px-4 gap-4 hover:bg-back-two transition-colors ease-in-out duration-200",
      combine ? null : "mt-4 pt-1"
    )}>
      <div className={cn(
        "rounded-full overflow-hidden",
        combine ? "w-[40px]" : "size-[40px]"
      )}>
        {
          combine ? null : (
            <Image
              src={message.sender?.avatar || "/images/avatar.png"}
              className="rounded-full size-[40px] cursor-pointer"
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
            combine ? null : (
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
            combine && (
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
