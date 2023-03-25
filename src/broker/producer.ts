import { Kafka } from "kafkajs";
import { Config } from "../config.js";

export interface Producer {
  start: () => Promise<void>;
  send: (message: string) => Promise<void>;
  stop: () => Promise<void>;
}

export const newProducer = (kafka: Kafka): Producer => {
  const producer = kafka.producer();
  return {
    start: async () => await producer.connect(),
    send: async (message: string) => {
      await producer.connect();
      await producer.send({
        topic: Config.KAFKA_CHAT_TOPIC,
        messages: [
          { value: message, headers: { clientId: Config.KAFKA_CLIENT_ID } },
        ],
      });
    },
    stop: async () => await producer.disconnect(),
  };
};
