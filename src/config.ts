import { randomUUID } from "crypto";

const parseBrokers = (brokers: string | undefined) => {
  if (!brokers) return undefined;
  return brokers.split(",");
};
export const Config = {
  PORT: process.env.PORT || "9001",
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || randomUUID().toString(),
  KAFKA_BROKERS: parseBrokers(process.env.KAFKA_BROKERS) || ["localhost:9092"],
  KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID || randomUUID().toString(),
  KAFKA_CHAT_TOPIC: process.env.KAFKA_CHAT_TOPIC || "chat-topic",
  TOKEN_SECRET: process.env.TOKEN_SECRET || "SECRET!",
  TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY || "",
  TOKEN_PUBLIC_KEY: process.env.TOKEN_PUBLIC_KEY || "",
};
