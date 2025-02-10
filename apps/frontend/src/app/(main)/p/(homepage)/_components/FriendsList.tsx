"use client"
import { getFriendsList, deleteAcceptedRequests } from "@/actions/friend.action"
import InlineUserCard from "@/components/UserCard/inline-user-card"
import { FriendRequest, User } from "@prisma/client"
import { Session } from "next-auth"
import { useEffect, useState } from "react"
import { RequestFooter, RequestFooterAction } from "./RequestFooter"
import Image from "next/image"
import { SOCKET_EVENTS } from "@devcord/node-prisma/dist/constants/socket.const"
import { useSocket } from "@/providers/socket.provider"
import { FriendRequestWithSenderAndReceiver } from "@/types/friend.type"


const FriendsList = ({ session }: { session: Session }) => {
  const [friendsList, setFriendsList] = useState<{id: string, user:User}[]>([])
  const { socket } = useSocket()

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
          socket.emit(SOCKET_EVENTS.REMOVE_FRIEND, data)
        },
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

  useEffect(() => {

    const handleAcceptFriendRequest = (data: FriendRequestWithSenderAndReceiver) => {
      if (data.requesterId === session.user.id) {
        return setFriendsList((prev) => [...prev, { id: data.id, user: data.receiver }])
      }
      return setFriendsList((prev) => [...prev, { id: data.id, user: data.requester }])
    }

    const handleDeleteFriend = (data: FriendRequest) => {
      setFriendsList((prev) => prev.filter((friend) => friend.id !== data.id))
    }

    socket?.on(SOCKET_EVENTS.ACCEPT_FRIEND_REQUEST, handleAcceptFriendRequest)
    socket?.on(SOCKET_EVENTS.REMOVE_FRIEND, handleDeleteFriend)

    return () => {
      socket?.off(SOCKET_EVENTS.ACCEPT_FRIEND_REQUEST, handleAcceptFriendRequest)
      socket?.off(SOCKET_EVENTS.REMOVE_FRIEND, handleDeleteFriend)
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
