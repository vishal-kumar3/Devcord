"use client"

import { useEffect, useState } from "react"
import { getSocket } from "../../lib/socket.config"

const Chat = () => {

  // const [chat, setChat] = useState<string[]>([])
  const socket = getSocket().connect()

  useEffect(() => {
    socket.on("message", (data) => {
      console.log("Socket msg is", data)
      // setChat([...chat, data.msg])
    })

    return () => {
      socket.close()
    }
  })

  return (
    <div>
      {/* <div>
        {chat.map((msg, index) => {
          return (
            <div key={index}>{msg}</div>
          )
        })}
      </div> */}
      <form action={(data) => {
        const msg = data.get("msg")
        if(!msg) return
        socket.emit("message", { msg: msg})
      }}>
        <input type="text" name="msg" />
        <button type="submit">Send Msg</button>
      </form>
    </div>
  )
}

export default Chat
