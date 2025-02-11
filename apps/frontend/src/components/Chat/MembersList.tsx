import { User } from "@prisma/client"
import { UserConversationWithUser } from "../../types/userConversation.type"
import Image from "next/image"
import { AddMembers } from "../HomePage/AddMembers"
import { useEffect, useState } from "react"
import { setSocketMetadata } from "@/lib/socket.config"
import { AddMembersData, RemoveMembersData, SOCKET_EVENTS } from "@devcord/node-prisma/dist/constants/socket.const"
import { removeMemberFromConversation } from "@/actions/conversation.action"
import { toast } from "sonner"
import { useSocket } from "@/providers/socket.provider"

// WIP: socket for online offline, also ui
// WIP: Add user to conversation
// use revalide to membersList action and also optimistic update

export function MembersList(
  { membersList, conversationId }
    :
    {
      membersList: UserConversationWithUser[],
      conversationId: string
    }
) {
  const [members, setMembers] = useState<UserConversationWithUser[]>(membersList)

  const { socket } = useSocket()

  useEffect(() => {
    if(!socket) return
    socket.connect()
    setSocketMetadata(socket, { room: conversationId })

    const handleAddMembers = (data: AddMembersData) => {
      const { members } = data
      setMembers((prevMembers) => [...prevMembers, ...members])
    }

    const handleRemoveMembers = (data: RemoveMembersData) => {
      const { members } = data
      setMembers((prevMembers) =>
        prevMembers.filter((user) => !members.includes(user.userId)) )
    }

    socket.on(SOCKET_EVENTS.REMOVE_MEMBERS, handleRemoveMembers)
    socket.on(SOCKET_EVENTS.ADD_MEMBERS, handleAddMembers)

    return () => {
      socket.off(SOCKET_EVENTS.ADD_MEMBERS, handleAddMembers)
      socket.off(SOCKET_EVENTS.REMOVE_MEMBERS, handleRemoveMembers)
      socket.disconnect()
    }
  }, [socket, conversationId])

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <p className="font-semibold">Members - { members.length }</p>
        <AddMembers restrictedUser={members} conversationId={conversationId} />
      </div>
      <div className="overflow-y-auto h-full space-y-1">
        {
          members.map((member) => {
            return (
              <Member key={member.userId} conversationId={conversationId} user={member.user} />
            )
          })
        }
      </div>
    </div>
  )
}


const Member = ({ user, conversationId }: { user: User, conversationId: string}) => {
  const { socket } = useSocket()
  return (
    <div className="flex gap-2 items-center hover:bg-back-three cursor-pointer p-1">
      <div className="size-[40px rounded-full">
        <Image
          src={user.avatar || '/images/default-profile.png'}
          alt={user.name || user.username || 'User'}
          className="rounded-full overflow-hidden"
          width={40}
          height={40}
        />
      </div>
      <p>
        {user.username}
      </p>
      <button onClick={async () => {
        const remainingUsers = await removeMemberFromConversation({
          conversationId,
          userId: user.id
        })
        if (!remainingUsers) {
          toast.error("Error while removing user")
        }

        if (remainingUsers) {
          socket?.emit(SOCKET_EVENTS.REMOVE_MEMBERS, {
            conversationId,
            members: [user.id]
          })
        }
      }}>x</button>
    </div>
  )
}
