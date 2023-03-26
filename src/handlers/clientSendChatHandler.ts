import { ClientMessageHandler } from "./handler.js";
import {
  isClientSendChatMessage,
  newChatMessageNotificationMessage,
  newErrorResponseMessage,
} from "../protocol.js";
import { getHub } from "../hub.js";

export const clientSendChatHandler: ClientMessageHandler = {
  handle: (message, ws) => {
    if (isClientSendChatMessage(message)) {
      getHub().broadcast(
        newChatMessageNotificationMessage(
          ws.getUserData(),
          message.id,
          message.payload.clientId,
          message.payload.content,
          message.payload.position,
          message.payload.sentAt
        ),
        true
      );
    } else {
      ws.send(
        JSON.stringify(
          newErrorResponseMessage(message.id, "Invalid send chat message")
        )
      );
    }
  },
};
