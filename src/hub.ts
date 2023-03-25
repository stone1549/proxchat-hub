import { ServerMessage, ServerPayload } from "./protocol.js";
import { AuthInfo } from "./domain.js";
import { TemplatedApp, WebSocket } from "uWebSockets.js";
import { Producer } from "./broker/producer";

export interface Hub {
  addClient: (ws: WebSocket<AuthInfo>) => void;
  removeClient: (ws: WebSocket<AuthInfo>) => void;
  broadcast: (
    message: ServerMessage<ServerPayload>,
    sendToBroker: boolean
  ) => void;
}

class HubImpl implements Hub {
  private clients: WebSocket<AuthInfo>[] = [];
  private app: TemplatedApp;
  private producer: Producer;

  constructor(app: TemplatedApp, producer: Producer) {
    this.app = app;
    this.producer = producer;
  }

  addClient(ws: WebSocket<AuthInfo>) {
    this.clients.push(ws);
    ws.subscribe("chat");
  }

  removeClient(ws: WebSocket<AuthInfo>) {
    this.clients = this.clients.filter(
      (client) => client.getUserData().id !== ws.getUserData().id
    );
  }

  broadcast(
    message: ServerMessage<ServerPayload>,
    sendToBroker: boolean = true
  ) {
    this.app.publish("chat", JSON.stringify(message));
    if (sendToBroker) {
      this.producer.send(JSON.stringify(message)).catch((e) => {
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
