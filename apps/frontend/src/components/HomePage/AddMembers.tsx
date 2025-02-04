"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { User } from "@prisma/client"
import { searchByUsernameForConversation } from "../../actions/user.action"
import { debounce } from "../../utils/debounce"
import { AddMembersToConversation, createConversation, getConversationByUserIdsInDM } from "../../actions/conversation.action"
import { toast } from "sonner"
import { Check } from "lucide-react"
import Link from "next/link"
import { getSocket } from "@/lib/socket.config"
import { AddMembersData, SOCKET_EVENTS } from "@devcord/node-prisma/dist/constants/socket.const"
import { UserConversationWithUser } from "@/types/userConversation.type"

export type selectedUserType = {
  id: string
  username: string
}

type CreatePersonalConversationProps = {
  restrictedUser: UserConversationWithUser[]
  conversationId: string
}

// WIP: Jaha click kiya waha search box aaye

export function AddMembers({ restrictedUser, conversationId }: CreatePersonalConversationProps) {

  const [searchUsername, setSearchUsername] = useState<string>("")
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<selectedUserType[]>([])

  useEffect(() => {
    async function searchUser() {
      const users = await searchByUsernameForConversation({ username: searchUsername, page: 0, restrictedUser: restrictedUser.map(user => user.user.id) })
      setUsers(users || [])
    }

    debounce(searchUser, 500)()
  }, [searchUsername, restrictedUser])

  const toggleUser = (user: selectedUserType) => {
    setSelectedUser((prev) =>
      prev.some((u) => u.id === user.id) ? prev.filter((u) => u.id !== user.id) : [...prev, user],
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <Image src="/icons/Plus.svg" alt="+" width={20} height={20} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Add Members
          </DialogTitle>
          <DialogDescription>
            You can add {9 - selectedUser.length - (restrictedUser?.length || 0)} more friends
          </DialogDescription>
        </DialogHeader>
        <div className="px-2 space-y-1">
          <div className="bg-back-one flex flex-row flex-wrap gap-[1px] p-[4px]">
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
          <ExistingConversationButton selectedUser={selectedUser} />
          <div>
            {users.map((user) => (
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
                  {/* <Image src="/icons/User.svg" alt="user" width={20} height={20} /> */}
                  <span>{user.username}</span>
                </div>
                <div
                  className={`w-5 h-5 rounded-sm border ${selectedUser.some((u) => u.id === user.id) ? "bg-blue-500 border-blue-500" : "border-gray-500"
                    } flex items-center justify-center`}
                >
                  {selectedUser.some((u) => u.id === user.id) && <Check size={14} className="text-white" />}
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <div className="flex flex-col gap-2 w-full">
            <AddMembersButton
              selectedUser={selectedUser}
              buttonTitle={"Add Members"}
              restrictedUser={restrictedUser}
              conversationId={conversationId}
            />
            <div className="flex gap-2">
              <input
                type="text"
                disabled
                className="w-full text-base bg-back-three p-2 cursor-text placeholder:font-semibold"
                placeholder="OR, SEND AN INVITE LINK"
              />
              <Button className="text-base">Create</Button>
            </div>
            {/* WIP: Add invite link logic and show below line only when link generated! */}
            {/* <div className="text-sm text-text-description">Invite Link valid for 24 hrs</div> */}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const AddMembersButton = (
  { selectedUser, buttonTitle, restrictedUser = [], conversationId }
    :
    { selectedUser: selectedUserType[], buttonTitle: string, restrictedUser: UserConversationWithUser[], conversationId: string }
) => {

  const addMemberHandler = async ({ user, restrictedUser }: { user: selectedUserType[], restrictedUser: UserConversationWithUser[] }) => {
    if (!restrictedUser || !conversationId) return

    if (user.length + restrictedUser.length === 0) {
      return toast.error("Select atleast one user to add")
    }

    if (user.length + restrictedUser.length > 10) {
      return toast.error("You can't add more than 10 users")
    }

    const addedUsers = await AddMembersToConversation({ conversationId, users: user.map((u) => { return { id: u.id, username: u.username } }) })

    if (!addedUsers) {
      return toast.error("Error while adding members")
    }

    const socket = getSocket()
    socket.auth = {
      room: conversationId
    }

    socket.emit(SOCKET_EVENTS.ADD_MEMBERS, {
      conversationId,
      members: addedUsers
    } as AddMembersData)

    return toast.success("Members added successfully")
  }

  return (
    <Button
      className="w-full text-lg font-semibold"
      type="submit"
      onClick={() => {
        console.log(selectedUser, conversationId, restrictedUser)
        if(!conversationId || restrictedUser.length === 0) return
          addMemberHandler({ user: selectedUser, restrictedUser })
      }}
    >
      {buttonTitle}
    </Button>
  )
}

export type existingConversationType = {
  id: string
  name: string
}

//WIP: Update this ui using discord
export const ExistingConversationButton = ({ selectedUser }: { selectedUser: selectedUserType[] }) => {
  const [existingConversation, setExistingConversation] = useState<existingConversationType[]>([])

  useEffect(() => {
    async function getExistingConversation() {
      if (selectedUser.length === 0) return
      const conversations = await getConversationByUserIdsInDM(selectedUser.map((user) => user.id))
      if (conversations) {
        setExistingConversation([...conversations.map((conv) => {
          return {
            id: conv.id,
            name: conv.name as string
          }
        })])
      }
    }
    setExistingConversation([])
    getExistingConversation()
  }, [selectedUser])

  return (
    <div key={"existing conversations"} className="p-1 flex flex-row flex-wrap gap-1">
      {
        existingConversation.map((conversation) => {
          return (
            <>
              <Link
                href={`/p/user/${conversation.id}`}
                key={conversation.id}
                className="text-base font-semibold bg-back-two p-2"
              >
                {conversation.name}
              </Link>
            </>
          )
        })
      }
    </div>
  )
}

export const InputBackspace = (
  { searchUsername, setSearchUsername, setSelectedUser }
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
      className="bg-back-one min-w-[10ch] flex-1 text-white px-3 outline-none border-none focus:outline-none"
      value={searchUsername}
      onChange={(e) => setSearchUsername(e.target.value)}
      autoFocus
    />
  )
}
