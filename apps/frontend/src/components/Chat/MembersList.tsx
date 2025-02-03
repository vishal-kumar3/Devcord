import { User } from "@prisma/client"
import { UserConversationWithUser } from "../../types/userConversation.type"
import Image from "next/image"
import { selectedUserType } from "../HomePage/CreatePersonalConversation"
import { AddMembers } from "../HomePage/AddMembers"

// WIP: socket for online offline, also ui
// WIP: Add user to conversation
// use revalide to membersList action and also optimistic update

export function MembersList({ membersList }: { membersList: UserConversationWithUser[] }) {

  const restrictedUser: selectedUserType[] = []

  membersList.map((member) => {
    restrictedUser.push({
      id: member.userId,
      username: member.user.username as string
    })
  })

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <p className="font-semibold">Members - { membersList.length }</p>
        <AddMembers restrictedUser={restrictedUser} conversationId={membersList[0].conversationId} />
      </div>
      <div className="overflow-y-auto h-full space-y-1">
        {
          membersList.map((member) => {
            return (
              <Member key={member.userId} user={member.user} />
            )
          })
        }
      </div>
    </div>
  )
}


const Member = ({user}: {user: User}) => {
  return (
    <div className="flex gap-2 items-center hover:bg-back-three cursor-pointer p-1">
      <div className="size-[40px rounded-full">
        <Image
          src={user.image || '/images/default-profile.png'}
          alt={user.name || user.username || 'User'}
          className="rounded-full overflow-hidden"
          width={40}
          height={40}
        />
      </div>
      <p>
        {user.username}
      </p>
    </div>
  )
}
