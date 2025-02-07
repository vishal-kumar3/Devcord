import { FriendRquestData, SOCKET_EVENTS } from "@devcord/node-prisma/dist/constants/socket.const.js";
import { CustomSocket } from "../socket.js";
import { Server} from "socket.io"

export const handleFriendEvents = (socket: CustomSocket, io: Server) => {

  // SEND FRIEND REQUEST
  socket.on(SOCKET_EVENTS.SEND_FRIEND_REQUEST, async (data: FriendRquestData) => {
    console.log("SEND_FRIEND_REQUEST", data)
    io.to([data.receiverId, data.requesterId]).emit(SOCKET_EVENTS.RECEIVE_FRIEND_REQUEST, data)
  })

  // ACCEPT FRIEND REQUEST
  socket.on(SOCKET_EVENTS.ACTION_FRIEND_REQUEST, async (data: FriendRquestData) => {
    console.log("ACTION_FRIEND_REQUEST", data)
    io.to([data.receiverId, data.requesterId]).emit(SOCKET_EVENTS.ACTION_FRIEND_REQUEST, data)
  })
}
