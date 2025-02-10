import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Input } from "../ui/input"
import { getConversationByUserId } from "../../actions/conversation.action"
import { DMButton } from "./DmButton"
import { getAuthUser } from "@/actions/auth.action"
import { ExtendedUser } from "@/next-auth"
import DM from "./Dm"
import { Session } from "next-auth"
import { getFriendsList } from "@/actions/friend.action"



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
          <DMButton name="Friends" image="" href="/p" />
          <DMButton name="Shop" image="" href="/p/store" />
        </div>
        <div className="space-y-1 text-sm">
          <div className="text-neutral-400 flex justify-between font-semibold">
            <p className="font-semibold">DIRECT MESSAGE</p>
            <DMFetch session={session} />
          </div>
          {
            conversations?.map((conversation) => {
              return (
                <DMButton loggedUser={session.user} key={conversation.id} name={conversation.name!} image="" conversationId={conversation.id} />
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

const DMFetch = async ({ session }: { session: Session }) => {

  const friends = await getFriendsList(session)

  return (
    <DM session={session} friends={friends} />
  )
}

export default HomeSidebar
