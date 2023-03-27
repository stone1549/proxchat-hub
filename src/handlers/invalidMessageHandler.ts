import { ClientMessageHandler } from "./handler.js";
import { newErrorResponseMessage } from "../protocol.js";

export const invalidMessageHandler: ClientMessageHandler = {
  handle: (message, ws) => {
    ws.send(
      JSON.stringify(
        newErrorResponseMessage(message.id, 400, "Invalid message")
      )
    );
  },
};
