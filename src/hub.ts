import { ChatMessageNotificationMessage } from "./protocol.js";
import { UserInfo } from "./domain.js";
import { TemplatedApp, WebSocket } from "uWebSockets.js";
import { Producer } from "./broker/producer.js";
import { delay, haversineDistance } from "./util.js";

export interface Hub {
  addClient: (ws: WebSocket<UserInfo>) => void;
  removeClient: (ws: WebSocket<UserInfo>) => void;
  hasClient: (ws: WebSocket<UserInfo>) => boolean;
  broadcast: (
    message: ChatMessageNotificationMessage,
    sendToBroker: boolean
  ) => void;
}

class HubImpl implements Hub {
  private clients: WebSocket<UserInfo>[] = [];
  private app: TemplatedApp;
  private producer: Producer;

  constructor(app: TemplatedApp, producer: Producer) {
    this.app = app;
    this.producer = producer;
  }

  addClient(ws: WebSocket<UserInfo>) {
    this.clients.push(ws);
    ws.subscribe("chat");
  }

  removeClient(ws: WebSocket<UserInfo>) {
    this.clients = this.clients.filter(
      (client) => client.getUserData().id !== ws.getUserData().id
    );
  }

  hasClient(ws: WebSocket<UserInfo>) {
    return this.clients.some(
      (client) => client.getUserData().id === ws.getUserData().id
    );
  }

  broadcast(
    message: ChatMessageNotificationMessage,
    sendToBroker: boolean = true
  ) {
    delay(0).then(() => {
      this.clients.forEach((client) => {
        if (
          haversineDistance(
            client.getUserData().position.lat,
            client.getUserData().position.long,
            message.payload.message.position.lat,
            message.payload.message.position.long
          ) < client.getUserData().radiusOfInterestMeters
        ) {
          try {
            client.send(JSON.stringify(message));
          } catch (e) {
            console.error(
              `Error sending message to client with id ${
                client.getUserData().id
              }`,
              e
            );
          }
        }
      });
    });

    if (sendToBroker) {
      this.producer
        .send(message.payload.message.sender.id, JSON.stringify(message))
        .catch((e) => {
          console.error(e);
        });
    }
  }
}

let hub: Hub;

export const initHub = (app: TemplatedApp, producer: Producer) =>
  (hub = new HubImpl(app, producer));
export const getHub = () => {
  if (!hub) {
    throw new Error("Hub not initialized");
  }
  return hub;
};
