import { ClientMessageHandler } from "./handler.js";
import {
  isClientHandshakeMessage,
  newHandshakeResponseMessage,
  newErrorResponseMessage,
} from "../protocol.js";
import { WebSocket } from "uWebSockets.js";
import { UserInfo } from "../domain.js";
import { getHub } from "../hub.js";

export const clientHandshakeHandler: ClientMessageHandler = {
  handle: (message, ws: WebSocket<UserInfo>) => {
    if (isClientHandshakeMessage(message) && message.token) {
      // this conditional prevents clients that send multiple handshake messages from being added to the hub multiple times
      if (getHub().hasClient(ws)) {
        ws.send(
          JSON.stringify(
            newErrorResponseMessage(message.id, 409, "Already shook hands")
          )
        );
        return;
      }

      ws.getUserData().position = message.payload.position;
      ws.getUserData().radiusOfInterestMeters = message.payload.radius;
      ws.send(
        JSON.stringify(newHandshakeResponseMessage(message.id, undefined))
      );
      getHub().addClient(ws);
    } else {
      ws.send(
        JSON.stringify(
          newErrorResponseMessage(message.id, 500, "Invalid handshake message")
        )
      );
    }
  },
};
