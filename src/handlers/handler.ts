import { ClientMessage, ClientPayload } from "../protocol.js";
import { WebSocket } from "uWebSockets.js";
import { clientHandshakeHandler } from "./clientHandshakeHandler.js";
import { UserInfo } from "../domain.js";
import { invalidMessageHandler } from "./invalidMessageHandler.js";
import { clientSendChatHandler } from "./clientSendChatHandler.js";
import { clientUpdateStateHandler } from "./clientUpdateStateHandler.js";

export interface ClientMessageHandler {
  handle: (
    message: ClientMessage<ClientPayload>,
    ws: WebSocket<UserInfo>
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
    case "UpdateState":
      return clientUpdateStateHandler;
    default:
      return invalidMessageHandler;
  }
};
