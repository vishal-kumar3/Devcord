"use client"
import { cn } from "@/lib/cn"
import { formatDate } from "@/utils/date_time"
import { MessageWithSenderAndAttachments } from "@devcord/node-prisma/dist/types/message.types";
import Image from "next/image"
import { ShowMessageImage, ShowMessageVideo } from "./ShowMessageFile";
import MessageContextMenu from "./MessageContextMenu";
import { useRef, useState } from "react";


// WIP: implement group message logic

const Message = ({ message }: { message: MessageWithSenderAndAttachments }) => {
  const [editing, setEditing] = useState<boolean>(false)
  const [msg, setMsg] = useState<string>(message.content || "")
  const [emojiSearch, setEmojiSearch] = useState<string>("")
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMsg(e.target.value)
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (msg.trim() === '') {
      return;
    }
    // onSave(msg);
    setMsg('');
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey && emojiSearch === '') {
      setEmojiSearch('');
      handleFormSubmit(event);
    }
  };

  const insertEmoji = (emoji: string) => {
    if (!textareaRef.current) return;

    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = msg.slice(0, cursorPosition);
    const textAfterCursor = msg.slice(cursorPosition);

    if (emojiSearch) {
      // Replace the emoji shortcode with the actual emoji
      const newTextBeforeCursor = textBeforeCursor.replace(/:(\w*)$/, emoji);
      const newContent = newTextBeforeCursor + textAfterCursor;
      setMsg(newContent);
      setEmojiSearch('');

      // Set cursor position after the inserted emoji
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = newTextBeforeCursor.length;
          textareaRef.current.selectionStart = newPosition;
          textareaRef.current.selectionEnd = newPosition;
        }
      }, 0);
    } else {
      // Insert emoji at cursor position
      const newContent = textBeforeCursor + emoji + textAfterCursor;
      setMsg(newContent);

      // Set cursor position after the inserted emoji
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = cursorPosition + emoji.length;
          textareaRef.current.selectionStart = newPosition;
          textareaRef.current.selectionEnd = newPosition;
        }
      }, 50);
    }

    adjustTextareaHeight();
  };

  return (
    <MessageContextMenu
      message={message}
      setEditing={setEditing}
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
        <form
          onSubmit={handleFormSubmit}
          className="space-y-1 w-full"
        >
          <div className="flex gap-3 items-center">
            <div className="text-text text-message-username font-semibold hover:underline cursor-pointer">
              {message.sender?.name}
            </div>
            <div className="text-message-time text-text-muted">
              {formatDate(message.createdAt)}
            </div>
          </div>
          {
            editing ? (
              <div className="relative w-full">
                <textarea
                  ref={textareaRef}
                  value={msg}
                  name="msg"
                  onChange={handleChange}
                  onKeyDown={handleKeyPress}
                  className="w-full h-auto bg-back-one rounded-xl text-gray-100 outline-none resize-none px-3 py-2 min-h-[40px] max-h-[50vh] overflow-y-auto"
                  style={{
                    lineHeight: '1.375rem',
                  }}
                />
              </div>
            ) : (
              <div className="text-text">{message.content}</div>
            )
          }
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
        </form>
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
