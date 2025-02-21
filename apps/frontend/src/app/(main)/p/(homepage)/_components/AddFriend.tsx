"use client"
import { sendFriendRequest } from "@/actions/friend.action"
import { useSocket } from "@/providers/socket.provider"
import { SOCKET_FRIEND } from "@devcord/node-prisma/dist/constants/socket.const"
import { useState } from "react"

export const AddFriend = () => {
  const [requestError, setRequestError] = useState<string | null>(null)
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null)
  const [username, setUsername] = useState<string>("")
  const { socket } = useSocket()

  const handlSendFriendRequest = async (username: string) => {
    setRequestError(null)
    setRequestSuccess(null)

    if (!username || username == "" || username.trim() == "") return setRequestError("Please enter a valid username")

    const { data, error } = await sendFriendRequest(username)

    if (!data) return setRequestError(error)
    socket?.connect()
    if (data.status === "ACCEPTED") {
      socket?.emit(SOCKET_FRIEND.ACCEPT, data)
      return setRequestSuccess("Friend request accepted")
    }

    if (data.status === "PENDING") {
      socket?.emit(SOCKET_FRIEND.SEND, data)
      return setRequestSuccess("Friend request sent!")
    }
    return setRequestError("Something went wrong")
  }

  return (
    <div>
      <p className="text-lg font-semibold">Add Friend</p>
      <p className="text-base mb-4">You can add friends with their Devcord username or Github username</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          handlSendFriendRequest(username)
          setUsername("")
        }}
        className="flex p-1 bg-back-one rounded-xl overflow-hidden"
      >
        <input
          className="px-4 bg-back-one flex-1 outline-none border-none"
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Devcord/Github username"
          autoComplete="off"
          autoFocus
        />
        <button
          type="submit"
          className="rounded-xl p-2 bg-blue-500"
        >Send Friend Request</button>
      </form>
      <p className="text-red-500 px-2">{requestError}</p>
      <p className="text-text-success px-2">{requestSuccess}</p>
    </div>
  )
}
