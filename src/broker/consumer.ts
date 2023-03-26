import { Hub } from "../hub.js";
import { Kafka } from "kafkajs";
import { Config } from "../config.js";
import { ChatMessageNotificationMessage } from "../protocol.js";

export interface Consumer {
  start: () => void;
  stop: () => void;
}
export const newConsumer = (kafka: Kafka, hub: Hub): Consumer => {
  const consumer = kafka.consumer({ groupId: Config.KAFKA_GROUP_ID });
  return {
    start: async () => {
      await consumer.subscribe({
        topic: Config.KAFKA_CHAT_TOPIC,
        fromBeginning: false,
      });
      await consumer.run({
        eachMessage: async ({ message }) => {
          try {
            if (
              message.value?.toString() &&
              message.headers?.clientId &&
              message.headers?.clientId?.toString() !== Config.KAFKA_CLIENT_ID
            ) {
              const serverMessage = JSON.parse(
                message.value.toString()
              ) as ChatMessageNotificationMessage;
              hub.broadcast(serverMessage, false);
            }
          } catch (e) {
            console.error(e);
          }
        },
      });
    },
    stop: async () => await consumer.stop(),
  };
};
