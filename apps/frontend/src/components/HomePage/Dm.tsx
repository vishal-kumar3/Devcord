"use client"
import { Session } from "next-auth"
import { DevPopover } from "../DevPopover"
import { FriendRequest, User } from "@prisma/client"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { AddMembersToConversation, createDMConversation, getExistingConversationByUserIds } from "@/actions/conversation.action"
import { useRouter } from "next/navigation"
import { getFriendsListForDM } from "@/actions/friend.action"
import { useSocket } from "@/providers/socket.provider"
import { SOCKET_CONVERSATION, SOCKET_FRIEND } from "@devcord/node-prisma/dist/constants/socket.const"
import Link from "next/link"
import { showConversationName } from "@/utils/conversation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { UserConversationWithUser } from "@devcord/node-prisma/dist/types/userConversation.types"
import { ConversationWithUsers } from "@devcord/node-prisma/dist/types/conversation.types"
import { FriendRequestWithSenderAndReceiver } from "@devcord/node-prisma/dist/types/friend.types"
import { CreateConversationEvent } from "@/events/socket/conversation.socket"

// WIP: for now static friends filter will be used and will implement pagination later and make it client side.

export type AddMembersProps = {
  restrictedUser: UserConversationWithUser[]
  conversationId: string
}

export type selectedUserType = {
  id: string
  username: string
}

const DM = (
  { session, addMembersData }
    :
    { session: Session, addMembersData?: AddMembersProps }
) => {
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

    socket.on(SOCKET_FRIEND.REMOVE, handleDeleteFriend)
    socket.on(SOCKET_FRIEND.ACCEPT, handleAcceptFriendRequest)

    return () => {
      socket.off(SOCKET_FRIEND.ACCEPT, handleAcceptFriendRequest)
      socket.off(SOCKET_FRIEND.REMOVE, handleDeleteFriend)
      setSelectedUser([])
    }
  }, [session, socket])

  return (
    <DevPopover
      title="Select Friends"
      description={`You can add ${10 - selectedUser.length - (addMembersData?.restrictedUser.length || 0) - 1} more friends.`}
      Main={
        <DMBody
          friends={friends}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          addMembersData={addMembersData}
        />
      }
      Footer={
        addMembersData
          ? <AddMembersFooter conversationId={addMembersData.conversationId} />
          :
          <DMFooter selectedUser={selectedUser} />
      }
    />
  )
}

export const DMFooter = (
  {
    selectedUser,
  }:
    {
      selectedUser: selectedUserType[],
    }) => {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [existingConversation, setExistingConversation] = useState<ConversationWithUsers[]>([])
  const router = useRouter()
  const { data: session } = useSession()
  const { socket } = useSocket()
  if (!session) return null

  return (
    <>
      <button
        onClick={async () => {
          if (selectedUser.length === 0) {
            return
          }
          const ExistingConversation = await getExistingConversationByUserIds(selectedUser.map((user) => user.id)) ?? []
          if (selectedUser.length === 1 && ExistingConversation.length === 1 && ExistingConversation[0].type === 'DM') {
            return router.push(`/p/user/${ExistingConversation[0].id}`)
          }

          if (ExistingConversation?.length) {
            setExistingConversation(ExistingConversation)
            return setDialogOpen(true)
          }

          const createdConversation = await createDMConversation({ user: selectedUser })
          if (createdConversation) {
            CreateConversationEvent(socket, createdConversation)
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
                        className="bg-back-two flex-1 rounded-md"
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
              <button onClick={async () => {
                const createdConversation = await createDMConversation({ user: selectedUser })
                if (createdConversation) {
                  CreateConversationEvent(socket, createdConversation)
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
  { addMembersData,
    friends,
    selectedUser,
    setSelectedUser
  }
    :
    {
      addMembersData?: AddMembersProps,
      friends: User[],
      selectedUser: selectedUserType[],
      setSelectedUser: Dispatch<SetStateAction<selectedUserType[]>>
    }
) => {

  const [searchUsername, setSearchUsername] = useState<string>("")

  if (addMembersData) {
    friends = friends.filter((friend) => {
      return !addMembersData.restrictedUser.some((restrictedUser) => restrictedUser.userId === friend.id)
    })
  }

  const toggleUser = (user: selectedUserType) => {
    setSelectedUser((prev) =>
      prev.some((u) => u.id === user.id) ? prev.filter((u) => u.id !== user.id) : [...prev, user],
    )
  }


  return (
    <div>
      <div className="flex gap-2 py-3 items-center">
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
        {addMembersData && <AddMembers setSelectedUser={setSelectedUser} selectedUser={selectedUser} restrictedUser={addMembersData.restrictedUser} conversationId={addMembersData.conversationId} />}
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

export const AddMembers = (
  { selectedUser, setSelectedUser, restrictedUser, conversationId }
    :
    { selectedUser: selectedUserType[], setSelectedUser: Dispatch<SetStateAction<selectedUserType[]>>, restrictedUser: UserConversationWithUser[], conversationId: string }
) => {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [existingConversation, setExistingConversation] = useState<ConversationWithUsers[]>([])
  const router = useRouter()
  const { data: session } = useSession()
  const { socket } = useSocket()
  if (!session) return null
  restrictedUser = restrictedUser.filter((user) => user.userId !== session.user.id)

  return (
    <>
      <button
        className="bg-blue-400 hover:bg-blue-500 py-1 px-3"
        onClick={async () => {
          if (selectedUser.length === 0) {
            return
          }
          const ExistingConversation = await getExistingConversationByUserIds([...selectedUser.map((user) => user.id), ...restrictedUser.map((user) => user.userId)]) ?? []

          if (ExistingConversation?.length) {
            setExistingConversation(ExistingConversation)
            return setDialogOpen(true)
          }

          const { created, data, error } = await AddMembersToConversation({ conversationId, users: selectedUser })

          if (created) {
            setSelectedUser([])
            CreateConversationEvent(socket, created)
            router.push(`/p/user/${created.id}`)
            return toast.success("Selected members added!")
          }

          if (!data) {
            return toast.error(error)
          }

          setSelectedUser([])
          CreateConversationEvent(socket, data)
          socket?.emit(SOCKET_CONVERSATION.ADD_MEMBERS, { conversationId, members: data.users })
          toast.success("Members added successfully")
        }}
      >
        Add
      </button>
      {isDialogOpen &&
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
                        className="bg-back-two flex-1 rounded-md"
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
              <button onClick={async () => {
                const { created, data, error } = await AddMembersToConversation({ conversationId, users: selectedUser })

                if (created) {
                  setSelectedUser([])
                  CreateConversationEvent(socket, created)
                  router.push(`/p/user/${created.id}`)
                  return toast.success("Selected members added!")
                }

                if (!data) {
                  return toast.error(error)
                }

                setSelectedUser([])
                CreateConversationEvent(socket, data)
                socket?.emit(SOCKET_CONVERSATION.ADD_MEMBERS, { conversationId, members: data.users })
                toast.success("Selected members added!")
                return setDialogOpen(false)
              }} className="flex-1 p-2 hover:bg-blue-600 bg-blue-500">Add Members</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    </>
  )
}

// WIP: Implement user invite logic
export const AddMembersFooter = ({ conversationId }: { conversationId: string }) => {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Create Invite Link"
        // value={"Create Invite Link"}
        disabled
        className="flex-1 p-1 px-2 placeholder:text-white/50"
      />
      <button className="bg-blue-400 px-3">Create</button>
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
