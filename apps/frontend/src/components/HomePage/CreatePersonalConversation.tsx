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
import { createDmConversation, getConversationByUserIdsInDM } from "../../actions/conversation.action"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Check } from "lucide-react"
import Link from "next/link"
import { getSocket, setSocketMetadata } from "@/lib/socket.config"
import { auth } from "@/auth"
import { SOCKET_EVENTS } from "@devcord/node-prisma/dist/constants/socket.const"
import { useSession } from "next-auth/react"

export type selectedUserType = {
  id: string
  username: string
}
// WIP: Jaha click kiya waha search box aaye

export function CreatePersonalConversation() {

  const [searchUsername, setSearchUsername] = useState<string>("")
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<selectedUserType[]>([])


  useEffect(() => {
    async function searchUser() {
      const users = await searchByUsernameForConversation({ username: searchUsername, page: 0 })
      setUsers(users || [])
    }

    debounce(searchUser, 500)()
  }, [searchUsername])

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
            Start a conversation
          </DialogTitle>
          <DialogDescription>
            You can add {9 - selectedUser.length} more friends
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
            <StartChatButton
              selectedUser={selectedUser}
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const StartChatButton = (
  { selectedUser }
    :
    { selectedUser: selectedUserType[] }
) => {

  const session = useSession()
  const router = useRouter()
  const [existingConversation, setExistingConversation] = useState<existingConversationType[]>([])

  const createDmConversationHandler = async ({ user }: { user: selectedUserType[] }) => {
    if (selectedUser.length === 0) {
      return toast.error("Select atleast one user to start conversation")
    }
    if (selectedUser.length > 10) {
      return toast.error("You can't add more than 10 users")
    }

    const conversation = await createDmConversation({ user: selectedUser })
    if (!conversation) {
      return toast.error("Error while creating conversation")
    }
    // WIP: Work on making createDmConversation real-time
    // const socket = getSocket()
    // socket.connect()
    // setSocketMetadata(socket, { userId: session?.user.id })
    // socket.emit(SOCKET_EVENTS.CREATE_CONVERSATION, { userIds: selectedUser.map((user) => user.id) })
    toast.success("Conversation created successfully")
    return router.push(`/p/user/${conversation.id}`)
  }

  // WIP: Work on existing conversation

  const findExistingConversation = async () => {
    const conversation = await getConversationByUserIdsInDM(selectedUser.map((user) => user.id))
  }

  return (
    <Button
      className="w-full text-lg font-semibold"
      type="submit"
      onClick={() => {
        // setExistingConversation([])
        createDmConversationHandler({ user: selectedUser })
      }}
    >
      Start Chat
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
    getExistingConversation()
  }, [selectedUser])

  return (
    <div className="p-1 flex flex-row flex-wrap gap-1">
      {
        existingConversation.map((conversation) => {
          return (
            <Link
              href={`/p/user/${conversation.id}`}
              key={conversation.id}
              className="text-base font-semibold bg-back-two p-2"
            >
              {conversation.name}
            </Link>
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
