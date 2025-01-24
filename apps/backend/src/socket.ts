import { Server } from "socket.io";



export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("The socket is connected:- ", socket.id)

    socket.on("message", (data) => {
      console.log("Msg:- ", data)
      socket.broadcast.emit("message", data)
    })

    socket.on("disconnect", () => {
      console.log("A user disconnected:- ", socket.id)
    })
  })

}
