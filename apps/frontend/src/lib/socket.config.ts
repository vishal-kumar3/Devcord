import { SOCKET_CONVERSATION } from "@devcord/node-prisma/dist/constants/socket.const";
import { io, Socket } from "socket.io-client";

export type SocketMetadataType = {
  room?: string
}

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
  console.log("Joining room:- ", metadata.room)
  // socket.auth = {
  //   room: metadata.room,
  // }
  socket.emit(SOCKET_CONVERSATION.JOIN_CONVERSATION, metadata.room)
}
