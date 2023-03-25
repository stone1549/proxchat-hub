import { ClientMessageHandler } from "./handler.js";
import {
  isClientHandshakeMessage,
  newHandshakeResponseMessage,
  newErrorResponseMessage,
} from "../protocol.js";
import { WebSocket } from "uWebSockets.js";
import { AuthInfo } from "../domain.js";
import { getHub } from "../hub.js";

export const clientHandshakeHandler: ClientMessageHandler = {
  handle: (message, ws: WebSocket<AuthInfo>) => {
    if (isClientHandshakeMessage(message) && message.token) {
      ws.send(
        JSON.stringify(newHandshakeResponseMessage(message.id, undefined))
      );
      getHub().addClient(ws);
    } else {
      ws.send(
        JSON.stringify(
          newErrorResponseMessage(message.id, "Invalid handshake message")
        )
      );
    }
  },
};
