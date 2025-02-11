import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Input } from "../ui/input"
import { getConversationByUserId } from "../../actions/conversation.action"
import { DMButton } from "./DmButton"
import { getAuthUser } from "@/actions/auth.action"
import { ExtendedUser } from "@/next-auth"
import DM from "./Dm"
import Link from "next/link"
import Image from "next/image"


const HomeSidebar = async () => {
  const session = await getAuthUser()

  if (!session) return null
  const conversations = await getConversationByUserId(session.user.id)

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
          <SidebarButtons name="Friends" image="" href="/p" />
          <SidebarButtons name="Shop" image="" href="/p/store" />
        </div>
        <div className="space-y-1 text-sm">
          <div className="text-neutral-400 flex justify-between font-semibold">
            <p className="font-semibold">DIRECT MESSAGE</p>
            <DM session={session} />
          </div>
          {
            conversations?.map((conversation) => {
              return (
                <DMButton
                  conversation={conversation}
                  key={conversation.id}
                  session={session}
                />
              )
            })
          }
        </div>
      </div>
      {/* My Account */}
      <div className="absolute bottom-0 w-full">
        <AccountCard user={session.user} />
      </div>
    </div>
  )
}

const SidebarButtons = ({ href, image, name }: { href: string, image: string, name: string }) => {
  return (
    <Link href={href} className="py-1 px-3 flex justify-between items-center rounded-lg hover:bg-white hover:bg-opacity-10 text-neutral-400 hover:text-neutral-300 font-semibold text-base transition-all ease-in">
      <div className="flex items-center gap-2">
        <Avatar
          className="size-[40px]"
        >
          <AvatarImage src={image} alt={''} />
          <AvatarFallback>{''}</AvatarFallback>
        </Avatar>
        <div className="line-clamp-1">{name}</div>
      </div>
      <button className="min-w-[20px] min-h-[20px] flex justify-center items-center rounded-full bg-neutral-800 bg-opacity-70 hover:bg-neutral-700 hover:bg-opacity-70">
        <Image src="/icons/Close.svg" className="text-green-500" alt="x" width={20} height={20} />
      </button>
    </Link>
  )
}

const AccountCard = ({ user }: { user: ExtendedUser }) => {
  return (
    <div className="flex items-center gap-2 bg-neutral-800 bg-opacity-70 p-2">
      <Avatar
        className="size-[40px]"
      >
        <AvatarImage src={user.avatar || ""} alt={user.name.slice(0, 1)} />
        <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <div className="">
        <p className="text-lg leading-none">{user.username}</p>
        <p className="text-sm text-neutral-400 leading-none">{user.id}</p>
      </div>
      <div>
        {/* WIP: animated svg here:- mute, headphone, settings */}
      </div>
    </div>
  )
}



export default HomeSidebar
