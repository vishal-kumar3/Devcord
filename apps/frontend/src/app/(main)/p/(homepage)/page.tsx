
import TabSwitcher from "@/components/TabSwitcher";
import { AddFriend } from "./_components/AddFriend";
import { PendingRequest } from "./_components/PendingRequest";
import { getAuthUser } from "@/actions/auth.action";
import { getReceivedRequests, getSentRequests } from "@/actions/friend.action";
import FriendsList from "./_components/FriendsList";

const page = async () => {
  const session = await getAuthUser()
  if (!session) return null

  const sentRequest = await getSentRequests(session)
  const pendingRequest = await getReceivedRequests(session)

  return (
    <TabSwitcher
      defaultTab="Friends"
      tabs={[
        { name: "Online", component: <div>Online</div> },
        { name: "All", component: <FriendsList /> },
        {
          name: "Pending", component:
            <PendingRequest
              session={session}
              sentRequest={sentRequest.data || []}
              receivedRequest={pendingRequest.data || []}
            />
        },
        { name: "Add Friend", component: <AddFriend /> }
      ]}
    />
  )
}



export default page
