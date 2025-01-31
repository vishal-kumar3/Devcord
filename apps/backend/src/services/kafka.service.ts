import { prisma } from "@devcord/node-prisma/dist/index.js";
import { createConsumer, createProducer, kafka } from "../config/kafka.config.js"
import { CustomSocket } from "../socket.js";


export const produceMessage = async (topic, roomId, messages) => {
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
    console.log(`[msg][${roomId}]: `, messages);
  }
  catch (error) {
    console.error(error);
  }
}


export const consumeMessage = async (topic: string, roomId: string, socket: CustomSocket) => {
  const consumer = await createConsumer(roomId); 
  // Start consuming messages
  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ topic, partition, message, pause }) => {
      const { value } = message;
      const msgValue = JSON.parse(value.toString());

      if (msgValue.roomId !== roomId) return;

      try {
        console.log(`[msg][${roomId}]: `, msgValue);
        // Here you can store messages in your database or other processing
        // WIP: await prisma.
      } catch (error) {
        console.error('Kafka error: ', error);
        // Pause the consumer and resume after a timeout
        pause();
        setTimeout(() => {
          console.log('Resuming consumer...');
          consumer.resume([{ topic }]);
        }, 5000); // Retry after 5 seconds
      }
    }
  });
};
