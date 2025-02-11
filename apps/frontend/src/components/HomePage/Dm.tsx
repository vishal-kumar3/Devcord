"use client"
import { Session } from "next-auth"
import { DevPopover } from "../DevPopover"
import { FriendRequest, User } from "@prisma/client"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { selectedUserType } from "./CreatePersonalConversation"
import { Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { createDMConversation, getExistingConversationByUserIds } from "@/actions/conversation.action"
import { ConversationWithUsers } from "@/types/conversation.type"
import { useRouter } from "next/navigation"
import { getFriendsListForDM } from "@/actions/friend.action"
import { useSocket } from "@/providers/socket.provider"
import { SOCKET_EVENTS } from "@devcord/node-prisma/dist/constants/socket.const"
import { FriendRequestWithSenderAndReceiver } from "@/types/friend.type"
import Link from "next/link"
import { showConversationName } from "@/utils/conversation"
import { useSession } from "next-auth/react"


// WIP: for now static friends filter will be used and will implement pagination later and make it client side.

const DM = ({ session }: { session: Session }) => {
  const [friends, setFriends] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<selectedUserType[]>([])
  const { socket } = useSocket()

  useEffect(() => {
    const fetchFriends = async () => {
      const friends = await getFriendsListForDM()
      setFriends(friends ?? [])
    }

    fetchFriends()
  }, [])

  useEffect(() => {
    if (!socket) return

    const handleAcceptFriendRequest = (data: FriendRequestWithSenderAndReceiver) => {
      if (data.requesterId === session.user.id) {
        return setFriends((prev) => [...prev, data.receiver])
      }
      return setFriends((prev) => [...prev, data.requester])
    }

    const handleDeleteFriend = (data: FriendRequest) => {
      setFriends((prev) => prev.filter((friend) => friend.id !== data.requesterId))
      setFriends((prev) => prev.filter((friend) => friend.id !== data.receiverId))
    }

    socket.on(SOCKET_EVENTS.REMOVE_FRIEND, handleDeleteFriend)
    socket.on(SOCKET_EVENTS.ACCEPT_FRIEND_REQUEST, handleAcceptFriendRequest)

    return () => {
      socket.off(SOCKET_EVENTS.ACCEPT_FRIEND_REQUEST, handleAcceptFriendRequest)
      socket.off(SOCKET_EVENTS.REMOVE_FRIEND, handleDeleteFriend)
      setSelectedUser([])
    }
  }, [session, socket])

  return (
    <DevPopover
      title="Select Friends"
      description={`You can add ${10 - selectedUser.length - 1} more friends.`}
      Main={
        <DMBody
          friends={friends}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      }
      Footer={<DMFooter setSelectedUser={setSelectedUser} selectedUser={selectedUser} />}
    />
  )
}

export const DMFooter = (
  {
    selectedUser,
    setSelectedUser
  }:
    {
      selectedUser: selectedUserType[],
      setSelectedUser: Dispatch<SetStateAction<selectedUserType[]>>
    }) => {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [existingConversation, setExistingConversation] = useState<ConversationWithUsers[]>([])
  const router = useRouter()
  const {data: session} = useSession()
  if(!session) return null

  return (
    <>
      <button
        onClick={async () => {
          if (selectedUser.length === 0) {
            return
          }
          const ExistingConversation = await getExistingConversationByUserIds(selectedUser.map((user) => user.id)) ?? []
          console.log("[Before Filter] Conversations:- ", ExistingConversation)
          if (selectedUser.length === 1 && ExistingConversation.length === 1 && ExistingConversation[0].type === 'DM') {
            return router.push(`/p/user/${ExistingConversation[0].id}`)
          }

          if (ExistingConversation?.length) {
            setExistingConversation(ExistingConversation)
            return setDialogOpen(true)
          }

          const createdConversation = await createDMConversation({ user: selectedUser })
          if (createdConversation) {
            return router.push(`/p/user/${createdConversation.id}`)
          }
        }}
        className="py-2 w-full bg-blue-400"
      >Create DM</button>
      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl">Confirm New Group</DialogTitle>
              <DialogDescription>
                You already have a group with these people! Are you sure you want to create a new one?
              </DialogDescription>
            </DialogHeader>
            <div className="px-2">
              <div className="text-base font-bold">EXISTING GROUP</div>
              <div className="flex flex-col gap-2">
                {existingConversation.map((conversation) => {
                  return (
                    <div key={conversation.id} className="flex items-center p-2 bg-back-two gap-2 line-clamp-1">
                      <div className="size-7 bg-black rounded-full aspect-square"></div>
                      <Link
                        href={'/p/user/' + conversation.id}
                        key={conversation.id}
                        onClick={() => {
                          router.push(`/p/user/${conversation.id}`)
                        }}
                        className="bg-back-two rounded-md"
                      >
                        {showConversationName(conversation.name as string, conversation.nameEdited, session?.user.username)}
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
            <DialogFooter className="flex justify-around p-2">
              <button onClick={() => setDialogOpen(false)} className="flex-1 p-2 hover:underline bg-back-two hover:bg-back-three">Cancel</button>
              <button onClick={async() => {
                const createdConversation = await createDMConversation({ user: selectedUser })
                if (createdConversation) {
                  // setDialogOpen(false)
                  return router.push(`/p/user/${createdConversation.id}`)
                }
              }} className="flex-1 p-2 hover:bg-blue-600 bg-blue-500">Create Group</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>

  )
}

export const DMBody = (
  { update = false,
    friends,
    selectedUser,
    setSelectedUser
  }
    :
    {
      update?: boolean,
      friends: User[],
      selectedUser: selectedUserType[],
      setSelectedUser: Dispatch<SetStateAction<selectedUserType[]>>
    }
) => {

  const [searchUsername, setSearchUsername] = useState<string>("")

  const toggleUser = (user: selectedUserType) => {
    setSelectedUser((prev) =>
      prev.some((u) => u.id === user.id) ? prev.filter((u) => u.id !== user.id) : [...prev, user],
    )
  }


  return (
    <div>
      <div className="flex gap-2 py-3">
        <div className="bg-back-one flex flex-1 flex-row flex-wrap gap-[1px] p-[4px]">
          {
            selectedUser.map((user) => {
              return (
                <button
                  onClick={() => {
                    setSelectedUser((prevSelectedUser) => {
                      return prevSelectedUser.filter((selUser) => selUser.id !== user.id || selUser.username !== user.username)
                    })
                  }}
                  key={user.id}
                  className="flex gap-2 bg-black/80 p-1 px-3"
                >
                  {user.username}
                </button>
              )
            })
          }
          <InputBackspace setSelectedUser={setSelectedUser} searchUsername={searchUsername} setSearchUsername={setSearchUsername} />
        </div>
        {update && <button className="bg-blue-400 px-3">Add</button>}
      </div>

      <div>
        {friends.map((user) => {
          if (searchUsername && !user.username?.includes(searchUsername)) return null
          return (
            <div
              key={user.id}
              className="flex justify-between cursor-pointer w-full py-1 px-3 bg-back-two"
              onClick={() => {
                toggleUser({
                  id: user.id,
                  username: user.username as string
                })
              }}
            >
              <div className="flex items-center gap-2">
                <span>{user.username}</span>
              </div>
              <div
                className={`w-5 h-5 rounded-sm border ${selectedUser.some((u) => u.id === user.id) ? "bg-blue-500 border-blue-500" : "border-gray-500"
                  } flex items-center justify-center`}
              >
                {selectedUser.some((u) => u.id === user.id) && <Check size={14} className="text-white" />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const InputBackspace = (
  {
    searchUsername,
    setSearchUsername,
    setSelectedUser
  }
    : {
      searchUsername: string,
      setSearchUsername: Dispatch<SetStateAction<string>>,
      setSelectedUser: Dispatch<SetStateAction<selectedUserType[]>>
    }
) => {

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace' && searchUsername === "") {
        setSelectedUser((prevSelectedUser) => {
          return prevSelectedUser.slice(0, -1)
        })
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <input
      placeholder="Enter a username"
      className="bg-back-one min-w-[10ch] flex-1 text-white p-1 px-3 outline-none border-none focus:outline-none"
      value={searchUsername}
      onChange={(e) => setSearchUsername(e.target.value)}
      autoFocus
    />
  )
}


export default DM
