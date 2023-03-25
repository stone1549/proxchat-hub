import { ClientMessage, ClientPayload } from "../protocol.js";
import { WebSocket } from "uWebSockets.js";
import { clientHandshakeHandler } from "./clientHandshakeHandler.js";
import { AuthInfo } from "../domain.js";
import { invalidMessageHandler } from "./invalidMessageHandler.js";
import { clientSendChatHandler } from "./clientSendChatHandler.js";
import { Producer } from "../broker/producer";

export interface ClientMessageHandler {
  handle: (
    message: ClientMessage<ClientPayload>,
    ws: WebSocket<AuthInfo>
  ) => void;
}

export const getClientMessageHandler = (
  message: ClientMessage<ClientPayload>
): ClientMessageHandler => {
  switch (message.payload.type) {
    case "Handshake":
      return clientHandshakeHandler;
    case "SendChatMessage":
      return clientSendChatHandler;
    default:
      return invalidMessageHandler;
  }
};
