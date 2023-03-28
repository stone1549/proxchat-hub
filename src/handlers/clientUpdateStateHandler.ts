import { ClientMessageHandler } from "./handler.js";
import {
  isClientUpdateStateMessage,
  newErrorResponseMessage,
} from "../protocol.js";

export const clientUpdateStateHandler: ClientMessageHandler = {
  handle: (message, ws) => {
    if (isClientUpdateStateMessage(message)) {
      ws.getUserData().position = message.payload.position;
      ws.getUserData().radiusOfInterestMeters = message.payload.radius;
    } else {
      ws.send(
        JSON.stringify(
          newErrorResponseMessage(
            message.id,
            500,
            "Invalid update location message"
          )
        )
      );
    }
  },
};
