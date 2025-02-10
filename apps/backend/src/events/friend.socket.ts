import { FriendRquestData, SOCKET_EVENTS } from "@devcord/node-prisma/dist/constants/socket.const.js";
import { CustomSocket } from "../socket.js";
import { Server} from "socket.io"

export const handleFriendEvents = (socket: CustomSocket, io: Server) => {

  // SEND FRIEND REQUEST
  socket.on(SOCKET_EVENTS.SEND_FRIEND_REQUEST, async (data: FriendRquestData) => {
    io.to(data.receiverId).emit(SOCKET_EVENTS.RECEIVE_FRIEND_REQUEST, data)
  })

  // ACCEPT FRIEND REQUEST
  // WIP: data would be FriendRequestWithSenderAndReceiver
  socket.on(SOCKET_EVENTS.ACCEPT_FRIEND_REQUEST, async (data: FriendRquestData) => {
    //to remove the request from pending sent request.
    io.to(data.requesterId).emit(SOCKET_EVENTS.DECLINE_FRIEND_REQUEST, data)
    // add friend to both
    io.to([data.receiverId, data.requesterId]).emit(SOCKET_EVENTS.ACCEPT_FRIEND_REQUEST, data)
  })

  // DECLINE FRIEND REQUEST
  // WIP: data would be FriendRequestWithSenderAndReceiver
  socket.on(SOCKET_EVENTS.DECLINE_FRIEND_REQUEST, async (data: FriendRquestData) => {
    io.to(data.requesterId).emit(SOCKET_EVENTS.DECLINE_FRIEND_REQUEST, data)
  })

  // REMOVE FRIEND
  socket.on(SOCKET_EVENTS.REMOVE_FRIEND, async (data: FriendRquestData) => {
    if (socket.userId === data.requesterId) {
      io.to(data.receiverId).emit(SOCKET_EVENTS.REMOVE_FRIEND, data)
    } else {
      io.to(data.requesterId).emit(SOCKET_EVENTS.REMOVE_FRIEND, data)
    }
  })

  // WITHDRAW FRIEND REQUEST
  socket.on(SOCKET_EVENTS.WITHDRAW_FRIEND_REQUEST, async (data: FriendRquestData) => {
    io.to(data.receiverId).emit(SOCKET_EVENTS.WITHDRAW_FRIEND_REQUEST, data)
  })
}
