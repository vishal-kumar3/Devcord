import { io, Socket } from "socket.io-client";


let socket: Socket

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io("http://localhost:8000", { autoConnect: false })
  }

  return socket
}
