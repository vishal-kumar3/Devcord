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
import { Input } from "../ui/input"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { User } from "@prisma/client"
import { searchByUsername } from "../../actions/user.action"
import { debounce } from "../../utils/debounce"
import { createConversation } from "../../actions/conversation.action"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Check } from "lucide-react"

type selectedUserType = {
  id: string
  username: string
}

const dummySelectedUser: selectedUserType[] = [
  {
    id: '1',
    username: 'vishal1'
  },
  {
    id: '2',
    username: 'vishal2'
  },
  {
    id: '3',
    username: 'vishal3'
  },
  {
    id: '4',
    username: 'vishal4'
  },
  {
    id: '5',
    username: 'vishal5'
  },
  {
    id: '6',
    username: 'vishal6'
  },
  {
    id: '7',
    username: 'vishal7'
  },
  {
    id: '8',
    username: 'vishal8'
  },
  {
    id: '9',
    username: 'vishal9'
  },
]


export function CreatePersonalConversation() {

  const [searchUsername, setSearchUsername] = useState<string>("")
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<selectedUserType[]>(dummySelectedUser)
  const router = useRouter()

  useEffect(() => {
    async function searchUser() {
      const users = await searchByUsername({ username: searchUsername, page: 0 })
      setUsers(users || [])
    }

    // searchUser()
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
          <DialogTitle>Start a conversation</DialogTitle>
          <DialogDescription>
            You can add 9 more friends
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
          <Button
            className="w-full text-lg font-semibold"
            type="submit"
            onClick={async() => {
              const { error, data } = await createConversation({ user: selectedUser })
              if (!data || 'error' in data) {
                return toast.error(error)
              }
              toast.success("Conversation created successfully")
              return router.push(`/p/user/${data.id}`)
            }}
          >
            Start Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
