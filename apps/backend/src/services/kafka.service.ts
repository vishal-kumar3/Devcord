import { prisma } from "@devcord/node-prisma/dist/index.js";
import { createConsumer, createProducer, kafka } from "../config/kafka.config.js"
import { CustomSocket } from "../socket.js";
import { User } from "@prisma/client";

export type ChatMsg = {
  msg: string
  user: User
  conversationId: string
}

export const produceMessage = async (topic: string, roomId: string, messages: any) => {
  try {
    const producer = await createProducer();
    await producer.send({
      topic,
      messages: [
        {
          key: roomId,
          value: JSON.stringify({ messages })
        }
      ]
    })
  }
  catch (error) {
    console.error(error);
  }
}


export const consumeMessage = async (topic: string, roomId: string, socket: CustomSocket) => {
  const consumer = await createConsumer(roomId);
  await consumer.run({
    // autoCommit: true,
    eachMessage: async ({ topic, partition, message, pause }) => {
      const { key, value } = message;
      const roomIdKey = key.toString()
      const msg = JSON.parse(value.toString())
      if (roomIdKey !== roomId) return;

      try {
        const message_data = msg.messages as ChatMsg
        const db_message = await prisma.message.create({
          data: {
            content: message_data.msg,
            senderId: message_data.user.id,
            conversationId: message_data.conversationId,
            type: "TEXT"
          },
          include: {
            sender: true
          }
        })

        if (db_message) {
          socket.to(roomId).emit("message", db_message);
        }

      } catch (error) {
        console.error('Kafka error: ', error);
        pause();
        setTimeout(() => {
          console.log('Resuming consumer...');
          consumer.resume([{ topic }]);
        }, 5000);
      }
    }
  });
};
