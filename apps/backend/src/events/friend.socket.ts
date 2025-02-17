import { FriendRquestData, SOCKET_FRIEND } from "@devcord/node-prisma/dist/constants/socket.const.js";
import { CustomSocket } from "../socket.js";
import { Server} from "socket.io"

export const handleFriendEvents = (socket: CustomSocket, io: Server) => {

  // SEND FRIEND REQUEST
  socket.on(SOCKET_FRIEND.SEND, async (data: FriendRquestData) => {
    console.log("SEND FRIEND REQUEST", data)
    io.to(data.receiverId).emit(SOCKET_FRIEND.RECEIVE, data)
  })

  // ACCEPT FRIEND REQUEST
  // WIP: data would be FriendRequestWithSenderAndReceiver
  socket.on(SOCKET_FRIEND.ACCEPT, async (data: FriendRquestData) => {
    //to remove the request from pending sent request.
    io.to(data.requesterId).emit(SOCKET_FRIEND.DECLINE, data)
    // add friend to both
    io.to([data.receiverId, data.requesterId]).emit(SOCKET_FRIEND.ACCEPT, data)
  })

  // DECLINE FRIEND REQUEST
  // WIP: data would be FriendRequestWithSenderAndReceiver
  socket.on(SOCKET_FRIEND.DECLINE, async (data: FriendRquestData) => {
    io.to(data.requesterId).emit(SOCKET_FRIEND.DECLINE, data)
  })

  // REMOVE FRIEND
  socket.on(SOCKET_FRIEND.REMOVE, async (data: FriendRquestData) => {
    if (socket.userId === data.requesterId) {
      io.to(data.receiverId).emit(SOCKET_FRIEND.REMOVE, data)
    } else {
      io.to(data.requesterId).emit(SOCKET_FRIEND.REMOVE, data)
    }
  })

  // WITHDRAW FRIEND REQUEST
  socket.on(SOCKET_FRIEND.WITHDRAW, async (data: FriendRquestData) => {
    io.to(data.receiverId).emit(SOCKET_FRIEND.WITHDRAW, data)
  })
}
