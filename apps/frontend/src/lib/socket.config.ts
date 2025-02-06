import { io, Socket } from "socket.io-client";

export type SocketMetadataType = {
  userId?: string
  room?: string
}

let socket: Socket

export const getSocket = (): Socket => {

  if (!socket) {
    socket = io("http://localhost:8000", { autoConnect: false })
  }

  return socket
}

export const connectSocket = (socket: Socket) => {
  socket.connect()
}

export const setSocketMetadata = (socket: Socket, metadata: SocketMetadataType) => {
  socket.auth = {
    room: metadata.room,
    userId: metadata.userId
  }
}
