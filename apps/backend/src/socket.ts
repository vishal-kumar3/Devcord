import { Server, Socket } from "socket.io";
import { consumeMessage, produceMessage } from "./services/kafka.service.js";

export interface CustomSocket extends Socket {
  room?: string
}

export const setupSocket = (io: Server) => {
  io.use((socket: CustomSocket, next) => {
    const room = socket.handshake.auth.room || socket.handshake.headers.room;
    if (!room) {
      return next(new Error("Invalid room"));
    }
    socket.room = room;

    // Only start consuming if this is the first connection for this room
    consumeMessage("chat", room, socket);

    return next();
  });

  io.on("connection", (socket: CustomSocket) => {
    socket.join(socket.room);

    console.log("The socket is connected:- ", socket.id);

    // When a message is sent, forward it to all users in the room and produce to Kafka
    socket.on("message", (data) => {
      console.log("Msg:- ", data);
      io.to(socket.room).emit("message", data);
      // Produce the message to Kafka topic
      produceMessage("chat", socket.room, data);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected:- ", socket.id);
    });
  });
};
