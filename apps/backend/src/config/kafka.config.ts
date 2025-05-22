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

// create topic 'chat' if it doesn't exist
const admin = kafka.admin()
const existingTpoics = await admin.listTopics()
if (!existingTpoics.includes('chat')) {
  await admin.createTopics({
    topics: [{
      topic: 'chat',
      numPartitions: 1,
      replicationFactor: 1,
    }],
  })
}

let producer = null;

export const createProducer = async () => {
  if (producer) return producer;

  const _producer = kafka.producer({ idempotent: true })
  await _producer.connect()
  producer = _producer;
  return producer;
}

const consumers = {};

export const createConsumer = async (roomId: string) => {
  if (consumers[roomId]) {
    return consumers[roomId];
  }

  const consumer = kafka.consumer({ groupId: `chat-${roomId}` });
  await consumer.connect();

  consumers[roomId] = consumer;

  await consumer.subscribe({ topic: 'chat', fromBeginning: false });

  console.log(`Consumer[${Object.keys(consumers).length}] created for room: ${roomId}`);

  return consumer;
};
