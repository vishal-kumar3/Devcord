"use client"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import Image from "next/image"
import { User } from "@prisma/client"
import { useEffect, useState } from "react"
import { getSocket, setSocketMetadata } from "@/lib/socket.config"
import { SOCKET_EVENTS, TitleChangeData } from "@devcord/node-prisma/dist/constants/socket.const"
import { ExtendedUser } from "@/next-auth"

type DMButtonProps = {
  name: string
  image?: string
  href?: string
  loggedUser?: ExtendedUser
  conversationId?: string
}

export const DMButton = ({ name, image, href, loggedUser, conversationId }: DMButtonProps) => {
  const [dmName, setDmName] = useState<string>(name)

  const socket = getSocket()
  useEffect(() => {
    if (!conversationId) return
    socket.connect()
    setSocketMetadata(socket, { room: conversationId })

    const handleTitleChange = (data: TitleChangeData) => {
      const title = data.title
      const cId = data.conversationId
      if (cId !== conversationId) return
      setDmName(title)
    }

    socket.on(SOCKET_EVENTS.TITLE_CHANGE, handleTitleChange)

    return () => {
      socket.off(SOCKET_EVENTS.TITLE_CHANGE, handleTitleChange)
    }
  })

  return (
    <Link href={href || `/p/user/${conversationId}`} className="py-1 px-3 flex justify-between items-center rounded-lg hover:bg-white hover:bg-opacity-10 text-neutral-400 hover:text-neutral-300 font-semibold text-base transition-all ease-in">
      <div className="flex items-center gap-2">
        <Avatar
          className="size-[40px]"
        >
          <AvatarImage src={image} alt={''} />
          <AvatarFallback>{''}</AvatarFallback>
        </Avatar>
        <div className="line-clamp-1">{dmName.replace(loggedUser?.username || "", "")}</div>
      </div>
      <button className="min-w-[20px] min-h-[20px] flex justify-center items-center rounded-full bg-neutral-800 bg-opacity-70 hover:bg-neutral-700 hover:bg-opacity-70">
        <Image src="/icons/Close.svg" className="text-green-500" alt="x" width={20} height={20} />
      </button>
    </Link>
  )
}
