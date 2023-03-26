import { App, DEDICATED_DECOMPRESSOR } from "uWebSockets.js";
import { delay } from "./util.js";
import {
  ClientMessage,
  newErrorResponseMessage,
  ClientPayload,
} from "./protocol.js";
import { AuthInfo } from "./domain.js";
import { getClientMessageHandler } from "./handlers/handler.js";
import { getHub, initHub } from "./hub.js";
import { Config } from "./config.js";
import { Kafka } from "kafkajs";
import { newConsumer } from "./broker/consumer.js";
import { newProducer } from "./broker/producer.js";
import { clientAuthHandlerMiddleware } from "./handlers/clientAuthHandler.js";

const decoder = new TextDecoder("utf-8");

const app = App().ws<AuthInfo>("/*", {
  maxBackpressure: 1024,
  maxPayloadLength: 1024,
  compression: DEDICATED_DECOMPRESSOR,

  open: (ws) => {
    // close the connection if the client doesn't send a handshake message within 30 seconds
    delay(30000).then(() => {
      if (!ws.getUserData().username) {
        console.error(
          "Client did not send a handshake message within 30 seconds, closing connection"
        );
        ws.close();
      }
    });
  },
  // upgrade: (res, req, context) => {},
  // ping: (ws, message) => {},
  // pong: (ws, message) => {},
  message: (ws, message, isBinary) => {
    if (isBinary) {
      ws.send(
        JSON.stringify(
          newErrorResponseMessage(
            "unknown",
            "Binary messages are not supported"
          )
        )
      );
      return;
    }
    try {
      const parsedMessage: ClientMessage<ClientPayload> = JSON.parse(
        decoder.decode(message)
      );

      clientAuthHandlerMiddleware(
        getClientMessageHandler(parsedMessage)
      ).handle(parsedMessage, ws);
    } catch (e) {
      console.error(e);
      ws.send(
        JSON.stringify(
          newErrorResponseMessage("unknown", "Invalid message type")
        )
      );
    }
  },
  // subscription: (ws, topic, newCount, oldCount) => {},
  drain: (_) => {},
  close: (_, __, ___) => {},
});

const kafka = new Kafka({
  clientId: Config.KAFKA_CLIENT_ID,
  brokers: Config.KAFKA_BROKERS,
  retry: {
    retries: 3,
    initialRetryTime: 1000,
    maxRetryTime: 60000,
    multiplier: 7,
  },
});

const admin = kafka.admin();
await admin.connect();
let topics = await admin.listTopics();
// loop until the chat topic exists
while (topics.find((t) => t === Config.KAFKA_CHAT_TOPIC) === undefined) {
  try {
    await admin.createTopics({
      waitForLeaders: true,
      topics: [
        {
          topic: Config.KAFKA_CHAT_TOPIC,
          numPartitions: 1,
          replicationFactor: 3,
        },
      ],
    });
    await delay(5000);
    topics = await admin.listTopics();
  } catch (e) {
    console.error(e);
  }
}
await admin.disconnect();

const producer = newProducer(kafka);
await producer.start();
initHub(app, producer);
const consumer = newConsumer(kafka, getHub());

app
  .any("/*", (res, _) => {
    res.end("Nothing to see here!");
  })
  .listen(Number.parseInt(Config.PORT), (listenSocket) => {
    consumer.start();
    if (listenSocket) {
      console.log(`Listening to port ${Config.PORT}`);
    }
  });

await producer.stop();
