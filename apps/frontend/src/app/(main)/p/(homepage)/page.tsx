
import TabSwitcher from "@/components/TabSwitcher";
import { AddFriend } from "./_components/AddFriend";
import { PendingRequest } from "./_components/PendingRequest";
import { getAuthUser } from "@/actions/auth.action";
import { getReceivedRequests, getSentRequests } from "@/actions/friend.action";
import FriendsList from "./_components/FriendsList";

const page = async () => {
  const session = await getAuthUser()
  if (!session) return null


  return (
    <TabSwitcher
      defaultTab="Friends"
      tabs={[
        { name: "Online", component: <div>Online</div> },
        { name: "All", component: <FriendsList session={session} /> },
        {
          name: "Pending", component:
            <PendingRequest
              session={session}
            />
        },
        { name: "Add Friend", component: <AddFriend /> }
      ]}
    />
  )
}



export default page
