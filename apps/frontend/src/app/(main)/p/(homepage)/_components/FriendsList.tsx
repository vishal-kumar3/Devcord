import { getFriendsList } from "@/actions/friend.action"
import InlineUserCard from "@/components/UserCard/inline-user-card"


const FriendsList = async () => {

  const friendsList = await getFriendsList()

  if (!friendsList) return (
    <div>
      Error While Loading Friends
    </div>
  )

  if (friendsList.length === 0) return (
    <div>
      No Friends
    </div>
  )

  return (
    <div>
      {
        friendsList?.map((friend) => {
          return (
            <InlineUserCard
              key={friend.id}
              user={friend}
            />
          )
        })
      }
    </div>
  )
}

export default FriendsList
