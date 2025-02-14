"use client"
import { getReceivedRequestById, getReceivedRequests, getSentRequests, updateReceivedFriendRequest, updateSentFriendRequest } from "@/actions/friend.action"
import InlineUserCard from "@/components/UserCard/inline-user-card"
import { Session } from "next-auth"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { RequestFooter, RequestFooterAction } from "./RequestFooter"
import { useSocket } from "@/providers/socket.provider"
import { SOCKET_EVENTS, SOCKET_FRIEND } from "@devcord/node-prisma/dist/constants/socket.const"
import { FriendRequest } from "@prisma/client"
import { FriendRequestReceiveWithSender, FriendRequestSentWithReceiver, FriendRequestWithSenderAndReceiver } from "@devcord/node-prisma/dist/types/friend.types"


const receivedRequestFooterActionsCreator = (requesterId: string): RequestFooterAction[] => {
  return [
    {
      updateRequest: updateReceivedFriendRequest,
      status: 'ACCEPTED',
      icon: {
        src: "/icons/Checks.svg",
        alt: "Accept",
      },
      tooltipContent: "Accept",
      friendId: requesterId,
      socketEvent(socket, data) {
        socket.emit(SOCKET_FRIEND.ACCEPT, data)
      },
    },
    {
      updateRequest: updateReceivedFriendRequest,
      status: 'DECLINED',
      icon: {
        src: "/icons/Close.svg",
        alt: "Decline",
      },
      tooltipContent: "Decline",
      friendId: requesterId,
      socketEvent(socket, data) {
        socket.emit(SOCKET_FRIEND.DECLINE, data)
      },
    },
  ]
}

const sentRequestFooterActionsCreator = (receivedId: string): RequestFooterAction[] => {
  return [
    {
      updateRequest: updateSentFriendRequest,
      status: 'CANCELLED',
      icon: {
        src: "/icons/Close.svg",
        alt: "Withdraw",
      },
      tooltipContent: "Withdraw",
      friendId: receivedId,
      socketEvent(socket, data) {
        socket.emit(SOCKET_FRIEND.WITHDRAW, data)
      },
    },
  ]
}

export const PendingRequest = ({ session }: { session: Session }) => {

  const [sentRequests, setSentRequests] = useState<FriendRequestSentWithReceiver[]>([])
  const [receivedRequests, setReceivedRequests] = useState<FriendRequestReceiveWithSender[]>([])
  const { socket } = useSocket()

  useEffect(() => {
    const fetchRequests = async () => {
      const { data: sentRequests, error: sentError } = await getSentRequests(session)
      const { data: receivedRequests, error: receivedError } = await getReceivedRequests(session)

      if (!sentRequests || sentError) return toast.error(sentError || "Failed to fetch sent requests")
      if (!receivedRequests || receivedError) return toast.error(receivedError || "Failed to fetch received requests")

      setSentRequests(sentRequests)
      setReceivedRequests(receivedRequests)
      return
    }

    fetchRequests()
  }, [session])

  useEffect(() => {
    if (!socket) return

    const handleReceivedRequest = async (data: FriendRequest) => {
      if (receivedRequests.some((request) => request.id === data.id)) return
      const { data: receivedRequest, error } = await getReceivedRequestById(data.id)
      if (!receivedRequest || error) return toast.error(error || "Failed to fetch received request")
      return setReceivedRequests((prev) => [...prev, receivedRequest])
    }

    const handleDeclineRequest = (data: FriendRequestWithSenderAndReceiver) => {
      setSentRequests((prev) => prev.filter((request) => request.id !== data.id))
    }

    const handleWithdrawRequest = (data: FriendRequestWithSenderAndReceiver) => {
      setReceivedRequests((prev) => prev.filter((request) => request.id !== data.id))
    }

    socket.on(SOCKET_FRIEND.DECLINE, handleDeclineRequest)
    socket.on(SOCKET_EVENTS.RECEIVE_FRIEND_REQUEST, handleReceivedRequest)
    socket.on(SOCKET_FRIEND.WITHDRAW, handleWithdrawRequest)

    return () => {
      socket.off(SOCKET_EVENTS.RECEIVE_FRIEND_REQUEST, handleReceivedRequest)
    }
  })

  return (
    <div className="p-4 space-y-10">
      <div className="space-y-2">
        {
          sentRequests.length > 0 && (
            <div className="text-base font-semibold w-full border-b-2 border-back-four">SENT - {sentRequests.length}</div>
          )
        }
        <div>
          {
            sentRequests.map((request) => {
              return (
                <InlineUserCard
                  key={request.id}
                  user={request.receiver}
                  ActionFooter={
                    RequestFooter({
                      setRequests: setSentRequests,
                      actions: sentRequestFooterActionsCreator(request.receiverId),
                      socket: socket
                    })
                  }
                />
              )
            })
          }
        </div>
      </div>
      <div className="space-y-2">
        {
          receivedRequests.length > 0 && (
            <div className="text-base font-semibold w-full border-b-2 border-back-four">RECEIVED - {receivedRequests.length}</div>
          )
        }
        <div>
          {
            receivedRequests.map((request) => {
              return (
                <InlineUserCard
                  key={request.id}
                  user={request.requester}
                  ActionFooter={
                    RequestFooter({
                      setRequests: setReceivedRequests,
                      actions: receivedRequestFooterActionsCreator(request.requesterId),
                      socket: socket
                    })
                  }
                />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
