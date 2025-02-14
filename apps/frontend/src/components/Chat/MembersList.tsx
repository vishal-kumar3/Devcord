import Image from "next/image"
import { useEffect, useState } from "react"
import { setSocketMetadata } from "@/lib/socket.config"
import { AddMembersData, RemoveMembersData, SOCKET_CONVERSATION } from "@devcord/node-prisma/dist/constants/socket.const"
import { useSocket } from "@/providers/socket.provider"
import DM from "../HomePage/Dm"
import { useSession } from "next-auth/react"
import { UserConversationWithUser } from "@devcord/node-prisma/dist/types/userConversation.types"
import { MembersContextMenu } from "./MemberContextMenu"
import { Session } from "next-auth"

// WIP: socket for online offline, also ui
// WIP: Add user to conversation

export function MembersList(
  { membersList, conversationId }
    :
    {
      membersList: UserConversationWithUser[],
      conversationId: string
    }
) {
  const [members, setMembers] = useState<UserConversationWithUser[]>(membersList)
  const { data: session } = useSession()
  const { socket } = useSocket()
  const admin = members.find((member) => member.isAdmin) ?? null

  useEffect(() => {
    if (!socket) return
    socket.connect()
    setSocketMetadata(socket, { room: conversationId })

    const handleAddMembers = (data: AddMembersData) => {
      console.log("Data received:- ", data)
      const { members } = data
      setMembers((prevMembers) => [...prevMembers, ...members])
    }

    const handleRemoveMembers = (data: RemoveMembersData) => {
      const { members } = data
      setMembers((prevMembers) =>
        prevMembers.filter((user) => !members.includes(user.userId)))
    }

    socket.on(SOCKET_CONVERSATION.REMOVE_MEMBERS, handleRemoveMembers)
    socket.on(SOCKET_CONVERSATION.ADD_MEMBERS, handleAddMembers)

    return () => {
      socket.off(SOCKET_CONVERSATION.ADD_MEMBERS, handleAddMembers)
      socket.off(SOCKET_CONVERSATION.REMOVE_MEMBERS, handleRemoveMembers)
    }
  }, [socket, conversationId])

  if (!session) return null

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <p className="font-semibold">Members - {members.length}</p>
        <DM addMembersData={{ restrictedUser: members, conversationId }} session={session} />
      </div>
      <div className="overflow-y-auto h-full">
        {
          members.map((member) => {
            return (
              <Member adminUser={admin} session={session} key={member.userId} conversationId={conversationId} member={member} />
            )
          })
        }
      </div>
    </div>
  )
}


const Member = ({ member, conversationId, session, adminUser }: { member: UserConversationWithUser, conversationId: string, session: Session, adminUser: UserConversationWithUser | null }) => {
  const user = member.user
  return (
    <MembersContextMenu adminUser={adminUser} key={member.userId} session={session} member={member}>
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
      </div>
    </MembersContextMenu>
  )
}
