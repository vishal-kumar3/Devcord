import { prisma } from "@devcord/node-prisma/dist/index.js";
import { createConsumer, createProducer } from "../config/kafka.config.js"
import { CustomSocket } from "../socket.js";
import { User } from "@prisma/client";
import { DeleteConversationMessage, DeleteConversationMessageResponse, MessageData, SOCKET_CONVERSATION } from "@devcord/node-prisma/dist/constants/socket.const.js";

export type ChatMsg = {
  msg: string
  user: User
  conversationId: string
  prevSender?: string
  prevCreatedAt?: Date
}

export const produceMessage = async (topic: string, roomId: string, messages: MessageData) => {
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
        const message_data = msg.messages as MessageData
        const db_message = await prisma.message.create({
          data: {
            content: message_data.msg,
            sender: { connect: { id: message_data.user.id } },
            conversation: { connect: { id: message_data.conversationId } },
            attachment: {
              createMany: {
                data: message_data.attachments?.map(attachment => ({
                  id: attachment.id,
                  filename: attachment.fileName,
                  size: attachment.size,
                  url: attachment.url,
                  proxyUrl: attachment.proxyUrl || attachment.url,
                  contentType: attachment.contentType,
                  height: attachment.height,
                  width: attachment.width,
                  title: attachment.title,
                  conversationId: message_data.conversationId
                }))
              }
            }
          },
          include: {
            sender: true,
            attachment: true
          }
        })

        if (db_message) {
          socket.to(db_message.conversationId).emit(SOCKET_CONVERSATION.MESSAGE, db_message);
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
