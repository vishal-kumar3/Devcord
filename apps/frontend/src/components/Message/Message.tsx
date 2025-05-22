"use client"
import { cn } from "@/lib/cn"
import { formatDate } from "@/utils/date_time"
import { MessageWithSenderAndAttachments } from "@devcord/node-prisma/dist/types/message.types";
import Image from "next/image"
import { ShowMessageFile, ShowMessageImage, ShowMessageVideo, ShowOtherFiles } from "./ShowMessageFile";
import MessageContextMenu from "./MessageContextMenu";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/providers/socket.provider";
import { EmojiSuggestions } from "../Emoji/EmojiSuggestions";
import { RenderEmojiPicker } from "../Emoji/EmojiPicker";
import { SOCKET_CONVERSATION } from "@devcord/node-prisma/dist/constants/socket.const";
import { TypingEvent } from "../Chat/Chat";
import { User } from "@prisma/client";
import AttachmentViewer from "../AttachmentFiles/AttachmentViewer";
import ReactionTab, { MessageReactions } from "./Reaction";


// WIP: implement group message logic
export type MessageProps = {
  message: MessageWithSenderAndAttachments
  currentUser: User
  onDelete: (messageId: string) => void
  onEdit: (messageId: string, content: string, deleteAttachment: string[]) => void
  onReaction: (messasgeId: string, emoji: string) => void
}


const Message = ({ message, currentUser, onDelete, onEdit, onReaction }: MessageProps) => {
  const [editing, setEditing] = useState<boolean>(false)
  const [msg, setMsg] = useState<string>(message.content || "")
  const [emojiSearch, setEmojiSearch] = useState<string>("")
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const localTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [emojiSearchPosition, setEmojiSearchPosition] = useState({ top: 0 });
  const [deleteFiles, setDeleteFiles] = useState<string[]>([])
  const { socket } = useSocket()

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);


  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("keydown", handleKeyPress
      )
    }
  })

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey && emojiSearch === '') {
      setEmojiSearch('');
      onEditSave(event);
    }
    if (event.ctrlKey && event.key === 'c' && editing) {
      onEditCancel()
    }
    if ((event.key === "ArrowUp" || event.key === "ArrowDown") && emojiSearch.length > 1) {
      event.preventDefault();
    }
  };

  const setEdit = () => {
    setEditing(true);
    setTimeout(() => {
      adjustTextareaHeight()
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(msg.length, msg.length);
    }, 0);
  }

  const onEditCancel = () => {
    setEditing(false)
    setMsg(message.content || "")
    setDeleteFiles([])
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!socket) return
    const currentValue = e.target.value
    setMsg(e.target.value)
    adjustTextareaHeight()

    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = currentValue.slice(0, cursorPosition);
    const match = textBeforeCursor.match(/:(\w*)$/);

    if (match) {
      setEmojiSearch(match[1]);
      if (textareaRef.current) {
        setEmojiSearchPosition({
          top: parseInt(textareaRef.current.style.height) + 40,
        });
      }
    } else {
      setEmojiSearch('');
    }

    socket.emit(SOCKET_CONVERSATION.TYPING, {
      user: currentUser,
      conversationId: message.conversationId,
      typing: true
    } as TypingEvent)

    if (localTypingTimeoutRef.current) {
      clearTimeout(localTypingTimeoutRef.current)
    }

    localTypingTimeoutRef.current = setTimeout(() => {
      socket.emit(SOCKET_CONVERSATION.TYPING, {
        user: currentUser,
        conversationId: message.conversationId,
        typing: false
      } as TypingEvent)
    }, 2000)
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const onEditSave = (event) => {
    event.preventDefault();
    if (msg.trim() === message.content && deleteFiles.length === 0) {
      return onEditCancel()
    }
    onEdit(message.id, msg, deleteFiles)
    setEditing(false)
  }

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

  const onReactionClick = (emoji: string) => {
    onReaction(message.id, emoji)
  }

  return (
    <div className="relative">
      <MessageContextMenu
        message={message}
        setEditing={setEdit}
        currentUser={currentUser}
        onDelete={() => {
          onEditCancel()
          onDelete(message.id)
        }}
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
            onSubmit={onEditSave}
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
                  <EmojiSuggestions
                    isOpen={!!emojiSearch}
                    query={emojiSearch.toLocaleLowerCase()}
                    onSelect={(emoji) => {
                      insertEmoji(emoji)
                    }}
                    onClose={() => setEmojiSearch('')}
                    position={emojiSearchPosition}
                  />
                  <div className="relative">
                    <textarea
                      autoComplete="off"
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
                    <div className="flex gap-2 text-sm">
                      <div>
                        <span>ctrl + c to </span>
                        <button onClick={onEditCancel} className="text-red-500 hover:underline">cancel</button>
                      </div>
                      <div>
                        <span>enter to </span>
                        <button type="submit" className="text-text-success hover:underline">save</button>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0">
                    <RenderEmojiPicker
                      onSelect={(emoji) => insertEmoji(emoji)}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-text">
                  {message.content}
                  {
                    message.editedAt && <span className="text-xs opacity-70 ml-2">(edited)</span>
                    }
                    <MessageReactions reactions={message.reactions ?? []} />
                </div>
              )
            }
            <div className="grid grid-cols-2 gap-2 max-w-[460px]">
              {message.attachment?.map((attachment) => {
                if (deleteFiles.includes(attachment.id)) return null
                const isThirdAttachment = !attachment.contentType.includes("image") && !attachment.contentType.includes("video") && !attachment.contentType.includes("audio")
                return (
                  <ShowMessageFile
                    key={attachment.id}
                    isEditOn={editing}
                    onSelecteFile={() => {
                      if (!editing && !isThirdAttachment) setSelectedIndex(message.attachment.indexOf(attachment))
                    }}
                    attachment={attachment}
                    setDeleteFiles={setDeleteFiles}
                  >
                    {
                      isThirdAttachment ? <ShowOtherFiles isEditing={editing} attachment={attachment} />
                        :  attachment.contentType.includes("image") ?
                          <ShowMessageImage attachment={attachment} />
                          : attachment.contentType.includes("video") ?
                            <ShowMessageVideo attachment={attachment} />
                            : null
                    }
                  </ShowMessageFile>
                )
              })}
            </div>
          </form>
          <ReactionTab onReactionClick={onReactionClick} />
        </div>
      </MessageContextMenu>
      <AttachmentViewer
        attachments={message.attachment}
        currentIndex={selectedIndex}
        isOpen={selectedIndex !== -1 && !editing}
        onClose={() => setSelectedIndex(-1)}
        onNavigate={(index) => setSelectedIndex(index)}
      />
    </div>
  )
}




export default Message
