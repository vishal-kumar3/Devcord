import { User } from "@prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"


const InlineUserCard = (
  {
    user,
    ActionFooter
  }: {
    user: User,
    ActionFooter?: React.ReactNode
  }
) => {
  return (
    <div className="group cursor-pointer flex items-center p-2 rounded-xl hover:bg-back-two transition-all ease-in-out justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="size-[45px] rounded-full aspect-square">
          <AvatarImage className="" src={user.avatar || ""} alt="" />
          <AvatarFallback>{user.username.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-base font-semibold group-hover:underline">{user.username}</div>
          <div className="text-sm">{user.name}</div>
        </div>
      </div>
      {ActionFooter}
    </div>
  )
}

export default InlineUserCard
