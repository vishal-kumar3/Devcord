import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Input } from "../ui/input"
import Image from "next/image"
import { prisma } from "../../db/prisma"
import { cookies } from "next/headers"
import { User } from "@prisma/client"
import { CreatePersonalConversation } from "./CreatePersonalConversation"
import { getConversationByUserId } from "../../actions/conversation.action"

const HomeSidebar = async () => {

  const cookie = await cookies()
  const session = cookie.get('session')
  if (!session) return null

  const loggedUser: User | null = (await prisma.session.findUnique({
    where: {
      id: session.value
    },
    select: {
      user: true
    }
  }).catch((err) => {
    console.error("Error while fetuching user using session", err.stack)
    return null
  })
  )?.user || null

  if (!session || !loggedUser) return null

  const conversations = await getConversationByUserId(loggedUser.id)

  return (
    <div className="relative bg-back-two h-screen">
      <div className="flex justify-center items-center border-b-2 border-divider w-full min-h-nav">
        <Input
          placeholder="Search"
          className="w-[90%] h-[70%] bg-neutral-800 border-none text-secondary"
        />
      </div>
      <div className="p-2 space-y-2">
        <div className="space-y-1">
          <DMButton name="Friends" image="" href="/p" />
          <DMButton name="Shop" image="" href="/p/store" />
        </div>
        <div className="space-y-1 text-sm">
          <div className="text-neutral-400 flex justify-between font-semibold">
            <p className="">DIRECT MESSAGE</p>
            <CreatePersonalConversation />
          </div>
          {
            conversations?.map((conversation) => {
              return (
                <DMButton key={conversation.id} name={conversation.name!} image="" href={`/p/user/${conversation.id}`} />
              )
            })
          }
        </div>
      </div>
      {/* My Account */}
      <div className="absolute bottom-0 w-full">
        <AccountCard user={loggedUser} />
      </div>
    </div>
  )
}

const AccountCard = ({ user }: { user: User }) => {
  return (
    <div className="flex items-center gap-2 bg-neutral-800 bg-opacity-70 p-2">
      <Avatar
        className="size-[40px]"
      >
        <AvatarImage src={''} alt={''} />
        <AvatarFallback>{''}</AvatarFallback>
      </Avatar>
      <div className="">
        <p className="text-lg leading-none">{user.username}</p>
        <p className="text-sm text-neutral-400 leading-none">{user.id}</p>
        <p className="text-sm text-neutral-400 leading-none">{user.boi || ""}</p>
      </div>
      <div>
        {/* WIP: animated svg here:- mute, headphone, settings */}
      </div>
    </div>
  )
}

type DMButtonProps = {
  name: string
  image: string
  href: string
}

const DMButton = ({ name, image, href }: DMButtonProps) => {
  return (
    <Link href={href} className="py-1 px-3 flex justify-between items-center rounded-lg hover:bg-white hover:bg-opacity-10 text-neutral-400 hover:text-neutral-300 font-semibold text-base transition-all ease-in">
      <div className="flex items-center gap-2">
        <Avatar
          className="size-[40px]"
        >
          <AvatarImage src={image} alt={''} />
          <AvatarFallback>{''}</AvatarFallback>
        </Avatar>
        <div>{name}</div>
      </div>
      <button className="relative z-50">
        <Image src="/icons/Close.svg" className="text-green-500" alt="x" width={20} height={20} />
      </button>
    </Link>
  )
}

export default HomeSidebar
