import { Server, Socket } from "socket.io";

interface CustomSocket extends Socket {
  room?: string
}

export const setupSocket = (io: Server) => {

  io.use((socket: CustomSocket, next) => {
    const room = socket.handshake.auth.room || socket.handshake.headers.room
    if (!room) {
      return next(new Error("Invalid room"))
    }
    socket.room = room
    return next()
  })

  io.on("connection", (socket: CustomSocket) => {

    socket.join(socket.room)

    console.log("The socket is connected:- ", socket.id)
    socket.on("message", (data) => {
      console.log("Msg:- ", data)
      io.to(socket.room).emit("message", data)
    })

    socket.on("disconnect", () => {
      console.log("A user disconnected:- ", socket.id)
    })
  })

}
