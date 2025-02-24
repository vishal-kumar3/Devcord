import { User } from "@prisma/client"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { TypingEvent } from "../Chat/Chat"
import { AttachmentData, MessageData, SOCKET_CONVERSATION } from "@devcord/node-prisma/dist/constants/socket.const"
import { cn } from "@/lib/cn"
import Image from "next/image"
import { setSocketMetadata } from "@/lib/socket.config"
import { useSocket } from "@/providers/socket.provider"
import { fileUpload } from "@/utils/FileUpload"
import { toast } from "sonner"
import { RenderEmojiPicker } from "../Emoji/EmojiPicker"
import { EmojiSuggestions } from "../Emoji/EmojiSuggestions"
import { ShowInputFiles } from "./ShowInputFile"


export const SendMessageInput = (
  { currentUser, conversationId, handleMessageSend }
    :
    {
      currentUser: User,
      conversationId: string,
      handleMessageSend: (data: MessageData) => Promise<{ error: string | null, success: boolean }>,
    }
) => {
  const { socket } = useSocket()
  const [message, setMessage] = useState<string>("")
  const [typingUsers, setTypingUsers] = useState<User[]>([])
  const incomingTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const localTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [files, setFiles] = useState<FileList | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false)
  const [emojiSearch, setEmojiSearch] = useState('');
  const [emojiSearchPosition, setEmojiSearchPosition] = useState({ top: 0 });

  const handleDeleteImage = (index: number) => {
    if (fileInputRef.current?.files && !isSendingMessage) {
      const newFilesArray = Array.from(fileInputRef.current.files);
      newFilesArray.splice(index, 1);

      const dataTransfer = new DataTransfer();
      newFilesArray.forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
      setFiles(fileInputRef.current.files);
    }
  }

  useEffect(() => {
    if (!socket) return
    setSocketMetadata(socket, { room: conversationId })

    const handleTyping = (data: TypingEvent) => {
      if (!data || data.conversationId != conversationId) return;
      setTypingUsers((prevUsers) => {
        const filteredUsers = prevUsers.filter(u => u.id !== data.user.id);
        if (data.typing) {
          return [...filteredUsers, data.user];
        } else {
          return filteredUsers;
        }
      });

      if (incomingTypingTimeoutRef.current) {
        clearTimeout(incomingTypingTimeoutRef.current);
      }

      incomingTypingTimeoutRef.current = setTimeout(() => {
        setTypingUsers((prevUsers) => prevUsers.filter(u => u.id !== data.user.id));
      }, 2000);
    }

    socket.on(SOCKET_CONVERSATION.TYPING, handleTyping)

    return () => {
      socket.off(SOCKET_CONVERSATION.TYPING, handleTyping)
    }
  }, [socket, conversationId])


  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!socket) return
    const currentValue = e.target.value
    setMessage(currentValue)
    adjustTextareaHeight()

    // Handle emoji search
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = currentValue.slice(0, cursorPosition);
    const match = textBeforeCursor.match(/:(\w*)$/);

    if (match) {
      setEmojiSearch(match[1]);
      if (textareaRef.current) {
        setEmojiSearchPosition({
          top: parseInt(textareaRef.current.style.height),
        });
      }
    } else {
      setEmojiSearch('');
    }

    socket.emit(SOCKET_CONVERSATION.TYPING, { user: currentUser, conversationId, typing: true } as TypingEvent)

    if (localTypingTimeoutRef.current) {
      clearTimeout(localTypingTimeoutRef.current)
    }

    localTypingTimeoutRef.current = setTimeout(() => {
      socket.emit(SOCKET_CONVERSATION.TYPING, { user: currentUser, conversationId, typing: false } as TypingEvent)
    }, 2000)
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if ((!files || files.length === 0) && (!message || !message.trim())) return
    setIsSendingMessage(true)
    const sendAttachmentsData: AttachmentData[] = []
    const sendMessageData: MessageData = {
      conversationId,
      msg: message,
      user: currentUser,
      attachments: sendAttachmentsData
    }

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const { error, data } = await fileUpload({ file: files[i], conversationId })
        if (error) return toast.error(error)
        if (data) sendAttachmentsData.push(data)
      }
    }

    const { success, error } = await handleMessageSend(sendMessageData)
    setIsSendingMessage(false)
    if (error) return toast.error(error)
    setMessage("")
    setFiles(null)
    if (!textareaRef.current) return
    textareaRef.current.style.height = "40px"

  }

  const handleKeyPress = (event) => {
    console.log(emojiSearch)
    if (event.key === "Enter" && !event.shiftKey && emojiSearch === '') {
      setEmojiSearch('');
      handleFormSubmit(event);
    }
    if((event.key === "ArrowUp" || event.key === "ArrowDown") && emojiSearch.length > 1) {
      event.preventDefault();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !fileInputRef.current?.files) return
    const dataTransfer = new DataTransfer();
    Array.from(e.target.files).forEach(file => dataTransfer.items.add(file));
    Array.from(files ?? []).forEach(file => dataTransfer.items.add(file));
    fileInputRef.current.files = dataTransfer.files;
    setFiles(dataTransfer.files)
  }

  const insertEmoji = (emoji: string) => {
    if (!textareaRef.current) return;

    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = message.slice(0, cursorPosition);
    const textAfterCursor = message.slice(cursorPosition);

    if (emojiSearch) {
      // Replace the emoji shortcode with the actual emoji
      const newTextBeforeCursor = textBeforeCursor.replace(/:(\w*)$/, emoji);
      const newContent = newTextBeforeCursor + textAfterCursor;

      setMessage(newContent);
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
      setMessage(newContent);

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

  // WIP: add typing user hover
  // WIP: handle multiple users typing like limit showing users typing
  return (
    <footer
      className={cn(
        "h-auto min-h-[50px]",
      )}
      style={{ gridArea: "footer" }}
    >
      <div className={cn("flex flex-row items-center gap-2 px-5 h-[20px] transition-all duration-300 w-[calc(100%-270px)]")}>
        {typingUsers.length > 0 && <div className="text-base size-[8px] rounded-full animate-pulse bg-text-highlighted" />}
        {
          typingUsers.map((user, index) => {
            return (
              <Image
                key={user.id || index}
                className="size-[15px] rounded-full"
                alt={user.name?.slice(0, 1) || user.username?.slice(0, 1) || user.email?.slice(0, 1)}
                src={user.avatar || "/images/default-profile.png"}
                width={15}
                height={15}
              />
            )
          })
        }
      </div>
      <div className="flex gap-2 px-2 overflow-x-scroll">
        <ShowInputFiles files={files} handleDeleteImage={handleDeleteImage} />
      </div>
      <form
        onSubmit={handleFormSubmit}
        className="px-4 py-1 flex gap-2"
      >
        <div className="relative px-2 bg-back-one rounded-xl flex-1">
          <EmojiSuggestions
            isOpen={!!emojiSearch}
            query={emojiSearch.toLocaleLowerCase()}
            onSelect={(emoji) => {
              insertEmoji(emoji)
            }}
            position={emojiSearchPosition}
          />
          <input
            type="file"
            name="attachment"
            id="attachment"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isSendingMessage}
            hidden
            multiple
          />
          <div className="flex items-start justify-between">
            <label
              className=""
              htmlFor="attachment"
            >
              <Image
                src='/icons/Add Text Message.svg'
                alt="Add Text Message"
                className={cn(
                  "cursor-pointer",
                  isSendingMessage && "opacity-50 cursor-wait"
                )}
                width={45}
                height={45}
              />
            </label>
            <textarea
              ref={textareaRef}
              className={cn(
                "w-full p-2 px-3 min-h-[35px] leading-5 max-h-[50vh] bg-transparent overflow-y-scroll resize-none rounded-xl outline-none border-none",
                isSendingMessage && "opacity-50 cursor-wait",
              )}
              placeholder="Type a message"
              name="msg"
              value={message}
              disabled={isSendingMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              autoFocus
              autoComplete="off"
            />
            <RenderEmojiPicker
              onSelect={(emoji) => insertEmoji(emoji)}
            />
          </div>
        </div>
      </form>
    </footer>
  )
}
