"use client"

import { useEffect, useState } from "react"
import { getSocket } from "../../lib/socket.config"
import { User } from "@prisma/client"
import ChatHeader from "./ChatHeader"

type ChatMsg = {
  msg: string
  author: string
}

const Chat = ({ conversationId, user }: { conversationId: string, user: User }) => {

  const [chat, setChat] = useState<ChatMsg[]>([])
  const socket = getSocket()

  useEffect(() => {
    // Connect to the socket once when the component mounts
    socket.connect()
    socket.auth = {
      room: conversationId
    }

    const handleMessage = (data: ChatMsg) => {
      console.log("Socket msg is", data)
      setChat((prevChat) => [...prevChat, { msg: data.msg, author: data.author }])
    }

    socket.on("message", handleMessage)

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.off("message", handleMessage)
      socket.disconnect()
    }
  }, [conversationId, socket])


  return (
    <div className="flex flex-col h-screen bg-back-three">
      <ChatHeader />
      <div className="flex-1">
        {chat.map((msg, index) => {
          return (
            <div key={index}>{msg.msg} by {msg.author}</div>
          )
        })}
      </div>
      <form
        className="p-4 flex gap-2"
        action={(data) => {
        const msg = data.get("msg") as string
        if (!msg) return
        const sendMsg = { msg: msg, author: user.username }
        socket.emit("message", sendMsg)
        // setChat((prevChat) => [...prevChat, sendMsg])
      }}>
        <input
          className="flex-1 p-2 px-3 rounded-md outline-none border-none"
          placeholder="Type a message"
          type="text"
          name="msg"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default Chat
