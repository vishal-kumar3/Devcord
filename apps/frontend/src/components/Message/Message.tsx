"use client"
import { cn } from "@/lib/cn"
import { formatDate } from "@/utils/date_time"
import { MessageWithSenderAndAttachments } from "@devcord/node-prisma/dist/types/message.types";
import Image from "next/image"
import { ShowMessageImage, ShowMessageVideo } from "./ShowMessageFile";
import MessageContextMenu from "./MessageContextMenu";
import { useState } from "react";


// WIP: implement group message logic

const Message = ({ message }: { message: MessageWithSenderAndAttachments }) => {
  const [editing, setEditing] = useState<boolean>(false)


  return (
    <MessageContextMenu
      message={message}
      currentUser="1"
    >
      <div className={cn(
        "relative flex group px-4 gap-4 hover:bg-back-two-two transition-colors ease-in-out duration-200 mt-4 pt-1"
      )}>
        <div className={cn(
          "rounded-full overflow-hidden size-[40px]"
        )}>
          <Image
            src={message.sender?.avatar || "/images/avatar.png"}
            className="rounded-full size-[40px] cursor-pointer"
            alt="avatar"
            width={40}
            height={40}
          />
        </div>
        <div className="space-y-1">
          <div className="flex gap-3 items-center">
            <div className="text-text text-message-username font-semibold hover:underline cursor-pointer">
              {message.sender?.name}
            </div>
            <div className="text-message-time text-text-muted">
              {formatDate(message.createdAt)}
            </div>
          </div>
          {message.content}
          <div className="grid grid-cols-2 gap-2 max-w-[900px]">
            {message.attachment?.map((attachment) => {
              if (attachment.contentType.includes("image")) {
                return <ShowMessageImage key={attachment.id} attachment={attachment} />
              }
              else if (attachment.contentType.includes("video")) {
                return <ShowMessageVideo key={attachment.id} attachment={attachment} />
              }
              else {
                return <div key={attachment.id} className="text-text-muted">{attachment.filename}</div>
              }
            })}
          </div>
        </div>
        <ReactionButtons />
      </div>
    </MessageContextMenu>
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
