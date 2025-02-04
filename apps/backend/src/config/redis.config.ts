import { Redis } from "ioredis";

const redis = new Redis({
  host: "localhost",
  port: 6379,
})


async function storeData(key, data) {
  // Convert data object to JSON string
  const jsonData = JSON.stringify(data);

  // Store the object in Redis
  redis.set(key, jsonData, (err, reply) => {
    if (err) {
      console.error('Error storing data:', err);
    } else {
      console.log('Data stored successfully:', reply);
    }
  });
}

async function fetchData(key) {
  redis.get(key, (err, reply) => {
    if (err) {
      console.error('Error fetching data:', err);
    } else {
      if (reply) {
        // Parse the JSON string back to an object
        const data = JSON.parse(reply);
        return data
      } else {
        return null
      }
    }
  });
}

// client.setex('user:123', 3600, jsonData);  // Data expires after 1 hour (3600 seconds)

export const setUserStatus = (userId, status) => {
  redis.setex(`user:${userId}:status`, 3600, status);
}

export const getUserStatus = (userId) => {
  return redis.get(`user:${userId}:status`);
}

export default redis
