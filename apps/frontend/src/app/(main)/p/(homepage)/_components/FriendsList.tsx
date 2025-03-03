"use client"
import { getFriendsList, deleteAcceptedRequests, getSenderAndReceiverById } from "@/actions/friend.action"
import InlineUserCard from "@/components/UserCard/inline-user-card"
import { FriendRequest, User } from "@prisma/client"
import { Session } from "next-auth"
import { useEffect, useState } from "react"
import { RequestFooter, RequestFooterAction } from "./RequestFooter"
import Image from "next/image"
import { useSocket } from "@/providers/socket.provider"
import { SOCKET_FRIEND } from "@devcord/node-prisma/dist/constants/socket.const"
import { FriendRequestWithSenderAndReceiver } from "@devcord/node-prisma/dist/types/friend.types"


const friendFooterActionsCreator = (receivedId: string): RequestFooterAction[] => {
  return [
    {
      updateRequest: deleteAcceptedRequests,
      friendId: receivedId,
      icon: {
        src: "/icons/Remove_Friend.svg",
        alt: "Remove Friend",
      },
      tooltipContent: "Remove Friend",
      socketEvent(socket, data) {
        socket.emit(SOCKET_FRIEND.REMOVE, data)
      },
    },
  ]
}

const FriendsList = ({ session }: { session: Session }) => {
  const [friendsList, setFriendsList] = useState<{ id: string, user: User }[]>([])
  const { socket } = useSocket()

  useEffect(() => {
    const fetchFriendsList = async (session: Session) => {
      const friendsList = await getFriendsList(session)
      if (!friendsList) return
      setFriendsList(friendsList)
    }

    fetchFriendsList(session)
  }, [session])

  useEffect(() => {

    const handleAcceptFriendRequest = async (data: FriendRequestWithSenderAndReceiver) => {
      const { data: request, error } = await getSenderAndReceiverById(data.id)

      if (!request || error) return

      if (data.requesterId === session.user.id) {
        return setFriendsList((prev) => [...prev, { id: request.id, user: request.receiver }])
      }
      return setFriendsList((prev) => [...prev, { id: request.id, user: request.requester }])
    }

    const handleDeleteFriend = (data: FriendRequest) => {
      setFriendsList((prev) => prev.filter((friend) => friend.id !== data.id))
    }

    socket?.on(SOCKET_FRIEND.ACCEPT, handleAcceptFriendRequest)
    socket?.on(SOCKET_FRIEND.REMOVE, handleDeleteFriend)

    return () => {
      socket?.off(SOCKET_FRIEND.ACCEPT, handleAcceptFriendRequest)
      socket?.off(SOCKET_FRIEND.REMOVE, handleDeleteFriend)
    }
  })


  return (
    <div className="p-4 space-y-2">
      <div className="font-semibold text-base w-full border-b-2 border-back-four">ALL FRIENDS - {friendsList.length}</div>
      {
        friendsList.map((friend) => {
          return (
            <InlineUserCard
              key={friend.id}
              user={friend.user}
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
                    <RequestFooter<{ id: string, user: User }>
                      setRequests={setFriendsList}
                      actions={friendFooterActionsCreator(friend.user.id)}
                      socket={socket}
                    />
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
