"use client"
import { getFriendsList, deleteAcceptedRequests } from "@/actions/friend.action"
import InlineUserCard from "@/components/UserCard/inline-user-card"
import { User } from "@prisma/client"
import { Session } from "next-auth"
import { useEffect, useState } from "react"
import { RequestFooter, RequestFooterAction } from "./RequestFooter"
import Image from "next/image"


const FriendsList = ({ session }: { session: Session }) => {
  const [friendsList, setFriendsList] = useState<User[]>([])

  const friendFooterActionsCreator = (receivedId: string): RequestFooterAction[] => {
    return [
      {
        updateRequest: deleteAcceptedRequests,
        status: "DECLINED",
        friendId: receivedId,
        icon: {
          src: "/icons/Remove_Friend.svg",
          alt: "Remove Friend",
        },
        tooltipContent: "Remove Friend",
      },
    ]
  }

  useEffect(() => {
    const fetchFriendsList = async (session: Session) => {
      const friendsList = await getFriendsList(session)
      if (!friendsList) return
      setFriendsList(friendsList)
    }

    fetchFriendsList(session)
  }, [session])

  return (
    <div className="p-4 space-y-2">
      <div className="font-semibold text-base w-full border-b-2 border-back-four">ALL FRIENDS - {friendsList.length}</div>
      {
        friendsList.map((friend) => {
          return (
            <InlineUserCard
              key={friend.id}
              user={friend}
              ActionFooter={
                (
                  <div className="flex flex-row gap-4">
                    <button>
                      <Image
                        src={'/icons/Messages.svg'}
                        alt="Profile"
                        width={35}
                        height={35}
                        className="size-[35px] p-1 aspect-square rounded-full bg-back-four hover:bg-back-three"
                      />
                    </button>
                    <RequestFooter setRequests={setFriendsList} actions={friendFooterActionsCreator(friend.id)} />
                  </div>
                )
              }
            />
          )
        })
      }
    </div>
  )
}

export default FriendsList
