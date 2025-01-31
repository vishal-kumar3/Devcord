import { Kafka, logLevel } from "kafkajs";


export const kafka = new Kafka({
  clientId: 'devcord',
  brokers: ['localhost:9092'],
  logLevel: logLevel.ERROR,
  retry: {
    initialRetryTime: 300,
    retries: 10
  }
})

let producer = null;

export const createProducer = async () => {
  if (producer) return producer;

  const _producer = kafka.producer({ idempotent: true })
  await _producer.connect()
  producer = _producer;
  return producer;
}

const consumers = {}; // Object to store consumers for each room

export const createConsumer = async (roomId: string) => {
  // Check if the consumer for the room already exists
  if (consumers[roomId]) {
    return consumers[roomId]; // Return existing consumer if already created for this room
  }

  // Create a new consumer for the room if it doesn't exist
  const consumer = kafka.consumer({ groupId: `chat-${roomId}` });
  await consumer.connect();

  consumers[roomId] = consumer; // Store the consumer for later reuse

  await consumer.subscribe({ topic: 'chat', fromBeginning: false });

  console.log(`Consumer created for room: ${roomId}`);

  return consumer;
};
