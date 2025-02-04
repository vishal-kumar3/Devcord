import { User } from "@prisma/client"
import { useEffect, useRef, useState } from "react"
import { Socket } from "socket.io-client"
import { TypingEvent } from "./Chat"
import { SOCKET_EVENTS } from "@devcord/node-prisma/dist/constants/socket.const"
import { cn } from "@/lib/utils"
import Image from "next/image"

export const SendMessageInput = (
  { user, conversationId, socket, handleMessageSend }
    :
    { user: User, conversationId: string, socket: Socket, handleMessageSend: (data: FormData) => void }
) => {

  const [typingUsers, setTypingUsers] = useState<User[]>([])
  const incomingTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const localTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    socket.auth = {
      room: conversationId
    }


    const handleTyping = (data: TypingEvent) => {
      if (!data) return;

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

    socket.on(SOCKET_EVENTS.TYPING, handleTyping)

    return () => {
      socket.off(SOCKET_EVENTS.TYPING, handleTyping)
    }
  }, [socket, conversationId])

  // WIP: add typing user hover
  // WIP: handle multiple users typing like limit showing users typing
  return (
    <footer
      style={{ gridArea: "footer" }}
    >
      <div className={cn(
        "flex flex-row items-center gap-2 px-5 h-[20px] w-[calc(100%-270px)]"
      )}>
        {typingUsers.length > 0 && <div className="text-base size-[8px] rounded-full animate-pulse bg-text-highlighted"></div>}
        {
          typingUsers.map((user, index) => {
            return (
              <Image
                key={user.id || index}
                className="size-[15px] rounded-full"
                alt={user.name?.slice(0, 1) || user.username?.slice(0, 1) || user.email?.slice(0, 1)}
                src={user.image || "/images/default-profile.png"}
                width={15}
                height={15}
              />
            )
          })
        }
      </div>
      <form
        className="p-4 flex gap-2 bg-back-two"
        action={(data) => handleMessageSend(data)}>
        <input
          className="flex-1 p-2 px-3 rounded-md outline-none border-none"
          placeholder="Type a message"
          type="text"
          name="msg"
          autoComplete="off"
          autoFocus
          onChange={() => {
            socket.emit(SOCKET_EVENTS.TYPING, { user, conversationId, typing: true } as TypingEvent)

            if (localTypingTimeoutRef.current) {
              clearTimeout(localTypingTimeoutRef.current)
            }

            localTypingTimeoutRef.current = setTimeout(() => {
              socket.emit(SOCKET_EVENTS.TYPING, { user, conversationId, typing: false } as TypingEvent)
            }, 1000)
          }}

        />
        <button type="submit">Send</button>
      </form>
    </footer>
  )
}
