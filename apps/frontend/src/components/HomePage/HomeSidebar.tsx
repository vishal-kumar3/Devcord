import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Input } from "../ui/input"
import { User } from "@prisma/client"
import { CreatePersonalConversation } from "./CreatePersonalConversation"
import { getConversationByUserId } from "../../actions/conversation.action"
import { getLoggedInUser } from "../../actions/user.action"
import { DMButton } from "./DmButton"
import { getAuthUser } from "@/actions/auth.action"
import { DevPopover } from "./DevPopover"



const HomeSidebar = async () => {
  const session = await getAuthUser()

  const loggedUser: User | null | undefined = await getLoggedInUser()
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
            <p className="font-semibold">DIRECT MESSAGE</p>
            <DevPopover />
          </div>
          {
            conversations?.map((conversation) => {
              return (
                <DMButton loggedUser={loggedUser} key={conversation.id} name={conversation.name!} image="" conversationId={conversation.id} />
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
        <p className="text-sm text-neutral-400 leading-none">{user.bio || ""}</p>
      </div>
      <div>
        {/* WIP: animated svg here:- mute, headphone, settings */}
      </div>
    </div>
  )
}

export default HomeSidebar
