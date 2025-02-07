import InlineUserCard from "@/components/UserCard/inline-user-card"
import { FriendRequestReceiveWithSender, FriendRequestSentWithReceiver } from "@/types/friend.type"
import { Session } from "next-auth"

export const PendingRequest = async (
  { sentRequest, receivedRequest, session }
    :
    {
      sentRequest: FriendRequestSentWithReceiver[],
      receivedRequest: FriendRequestReceiveWithSender[],
      session: Session
    }
) => {

  return (
    <div className="p-4 space-y-10">
      <div>
        <div className="text-base font-semibold">SENT</div>
        <div className="space-y-2 p-2 px-4">
          {
            sentRequest.map((request) => {
              return (
                <InlineUserCard
                  key={request.id}
                  user={request.receiver}
                />
              )
            })
          }
        </div>
      </div>
      <div>
        <div className="text-base font-semibold">RECEIVED</div>
        <div className="space-y-2 p-2 px-4">
          {
            receivedRequest.map((request) => {
              return (
                <InlineUserCard
                  key={request.id}
                  user={request.requester}
                />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
