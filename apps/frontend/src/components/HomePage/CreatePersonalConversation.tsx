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
import { useEffect, useState } from "react"
import { User } from "@prisma/client"
import { searchByUsername } from "../../actions/user.action"
import { debounce } from "../../utils/debounce"
import { createConversation } from "../../actions/conversation.action"
import { useRouter } from "next/navigation"

type selectedUserType = {
  id: string
  username: string
}

export function CreatePersonalConversation() {

  const [searchUsername, setSearchUsername] = useState<string>("")
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<selectedUserType[]>([])
  const  router = useRouter()

  useEffect(() => {
    async function searchUser() {
      const users = await searchByUsername({ username: searchUsername, page: 0 })
      setUsers(users || [])
    }

    // searchUser()
    debounce(searchUser, 500)()
  }, [searchUsername])

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
          <Input
            placeholder="Enter a username"
            className="bg-back-one text-white"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
          />
          <div>
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
                    className="flex gap-2 bg-black/80 p-1 px-3 rounded-full group"
                  >
                    {user.username}
                    <span className="hidden group-hover:block">x</span>
                  </button>
                )
              })
            }
          </div>
          <div>
            {users.map((user) => (
              <div key={user.id} className="flex justify-between w-full py-1 px-3 bg-back-two">
                <div className="flex items-center gap-2">
                  {/* <Image src="/icons/User.svg" alt="user" width={20} height={20} /> */}
                  <span>{user.username}</span>
                </div>
                <Input
                  type="checkbox"
                  className="w-6 bg-back-four"
                  onChange={(e) => {
                    console.log(e.target.checked)
                    if (selectedUser.length >= 10) return;
                    if (e.target.checked) {
                      setSelectedUser((prevSelectedUser) => {
                        if (!prevSelectedUser.some((selUser) => selUser.id === user.id && selUser.username === user.username)) {
                          return [...prevSelectedUser, { id: user.id, username: user.username }]
                        }
                        return prevSelectedUser
                      })
                    }
                    else {
                      setSelectedUser((prevSelectedUser) => {
                        return prevSelectedUser.filter((selUser) => selUser.id !== user.id || selUser.username !== user.username)
                      })
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            className="w-full text-lg font-semibold"
            type="submit"
            onClick={async() => {
              const conversation = await createConversation({ user: selectedUser })
              console.log(conversation)
              if (!conversation) return
              router.push(`/p/user/${conversation?.id}`)
            }}
          >
            Start Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
