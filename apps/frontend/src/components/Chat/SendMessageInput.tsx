import { User } from "@prisma/client"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { TypingEvent } from "./Chat"
import { SOCKET_CONVERSATION } from "@devcord/node-prisma/dist/constants/socket.const"
import { cn } from "@/lib/cn"
import Image from "next/image"
import { setSocketMetadata } from "@/lib/socket.config"
import { useSocket } from "@/providers/socket.provider"
import { toast } from "sonner"

export const SendMessageInput = (
  { user, conversationId, handleMessageSend }
    :
    {
      user: User,
      conversationId: string,
      handleMessageSend: (data: FormData) => Promise<{ error: string | null, success: boolean }>,
    }
) => {
  const { socket } = useSocket()
  const [message, setMessage] = useState<string>("")
  const [typingUsers, setTypingUsers] = useState<User[]>([])
  const incomingTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const localTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

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
    if(!socket) return
    setMessage(e.target.value)
    adjustTextareaHeight()

    socket.emit(SOCKET_CONVERSATION.TYPING, { user, conversationId, typing: true } as TypingEvent)

    if (localTypingTimeoutRef.current) {
      clearTimeout(localTypingTimeoutRef.current)
    }

    localTypingTimeoutRef.current = setTimeout(() => {
      socket.emit(SOCKET_CONVERSATION.TYPING, { user, conversationId, typing: false } as TypingEvent)
    }, 1000)
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px"
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 40), 300)}px`
    }
  }


  // WIP: add typing user hover
  // WIP: handle multiple users typing like limit showing users typing
  return (
    <footer
      className={cn(
        "h-auto min-h-[50px]",
      )}
      style={{ gridArea: "footer" }}
    >
      <div className={cn(
        "flex flex-row items-center gap-2 px-5 h-[20px] transition-all duration-300 w-[calc(100%-270px)]",
        // typingUsers.length > 0 ? "h-[20px] opacity-100" : "h-0 opacity-0"
      )}>
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
      <form className="px-4 py-1 flex gap-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            className="w-full p-2 px-3 h-[40px] max-h-[300px] overflow-y-scroll resize-none rounded-md outline-none border-none"
            placeholder="Type a message"
            name="msg"
            autoComplete="off"
            autoFocus
            value={message}
            onChange={handleInputChange}
            onKeyDown={async (e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                if (message.trim()) {
                  const formData = new FormData()
                  formData.append("msg", message)
                  const { success, error } = await handleMessageSend(formData)
                  if (error) return toast.error(error)
                  setMessage("")
                  if(!textareaRef.current) return
                  textareaRef.current.style.height = "40px"
                }
              }
            }}
          />
          <div
            className="absolute top-0 left-0 right-0 h-2 cursor-row-resize"
            onMouseDown={(e) => {
              e.preventDefault()
              const startY = e.clientY
              const startHeight = textareaRef?.current?.clientHeight || 0
              const handleMouseMove = (moveEvent: MouseEvent) => {
                const deltaY = startY - moveEvent.clientY
                const newHeight = Math.min(Math.max(startHeight + deltaY, 50), 300)
                if (textareaRef.current) {
                  textareaRef.current.style.height = `${newHeight}px`;
                }
              }
              const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove)
                document.removeEventListener("mouseup", handleMouseUp)
              }
              document.addEventListener("mousemove", handleMouseMove)
              document.addEventListener("mouseup", handleMouseUp)
            }}
          />
        </div>
        <button type="submit" className="">Send</button>
      </form>
    </footer>
  )
}
