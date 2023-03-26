import { ClientMessageHandler } from "./handler.js";
import {
  isClientUpdateLocationMessage,
  newErrorResponseMessage,
} from "../protocol.js";

export const clientUpdateLocationHandler: ClientMessageHandler = {
  handle: (message, ws) => {
    if (isClientUpdateLocationMessage(message)) {
      ws.getUserData().position = message.payload.position;
      ws.getUserData().radiusOfInterestMeters = message.payload.radius;
    } else {
      ws.send(
        JSON.stringify(
          newErrorResponseMessage(message.id, "Invalid update location message")
        )
      );
    }
  },
};
