import { io, Socket } from "socket.io-client";

export type SocketMetadataType = {
  room?: string
}

// WIP: sdfjhdfl


let socket: Socket

export const getSocket = (userId: string): Socket => {

  if (!socket && userId) {
    socket = io("http://localhost:8000", {
      autoConnect: false,
      query: { userId }
    })
  }

  return socket
}


export const setSocketMetadata = (socket: Socket, metadata: SocketMetadataType) => {
  socket.auth = {
    room: metadata.room,
  }
}
