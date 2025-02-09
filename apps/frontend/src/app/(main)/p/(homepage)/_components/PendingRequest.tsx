"use client"
import { getReceivedRequests, getSentRequests, updateReceivedFriendRequest, updateSentFriendRequest } from "@/actions/friend.action"
import InlineUserCard from "@/components/UserCard/inline-user-card"
import { FriendRequestReceiveWithSender, FriendRequestSentWithReceiver } from "@/types/friend.type"
import { Session } from "next-auth"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { RequestFooter, RequestFooterAction } from "./RequestFooter"

export const PendingRequest = ({ session }:{ session: Session }) => {

  const [sentRequests, setSentRequests] = useState<FriendRequestSentWithReceiver[]>([])
  const [receivedRequests, setReceivedRequests] = useState<FriendRequestReceiveWithSender[]>([])

  const receivedRequestFooterActionsCreator = (requesterId: string, receivedId: string): RequestFooterAction[] => {
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
      },
      {
        updateRequest: updateSentFriendRequest,
        status: 'DECLINED',
        icon: {
          src: "/icons/Close.svg",
          alt: "Decline",
        },
        tooltipContent: "Decline",
        friendId: receivedId,
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
      },
    ]
  }

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
                    RequestFooter({ setRequests: setSentRequests, actions: sentRequestFooterActionsCreator(request.receiverId) })
                    // sentRequestFooter({ sentRequest: request, setSentRequests })
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
                    RequestFooter({ setRequests: setReceivedRequests, actions: receivedRequestFooterActionsCreator(request.requesterId, request.receiverId) })

                    // receivedRequestFooter({ receivedRequest: request, setReceivedRequests })
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
