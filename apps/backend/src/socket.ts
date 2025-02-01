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
    consumeMessage("chat", room, socket);
    return next();
  });

  io.on("connection", (socket: CustomSocket) => {
    socket.join(socket.room);
    console.log("The socket is connected:- ", socket.id);

    socket.on("message", (data) => {
      produceMessage("chat", socket.room, data);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:- ", socket.id);
    });
  });
};
