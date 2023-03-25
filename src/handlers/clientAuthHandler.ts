import { ClientMessageHandler } from "./handler.js";
import fs from "fs";
import { newErrorResponseMessage } from "../protocol.js";
import jwt from "jsonwebtoken";
import { Config } from "../config.js";

// verify a token asymmetric
// const cert = fs.readFileSync("/proxchat-hub/data/sample.pem");

export const clientAuthHandlerMiddleware: (
  handler: ClientMessageHandler
) => ClientMessageHandler = (handler) => {
  return {
    handle: (message, ws) => {
      jwt.verify(
        message.token,
        Config.TOKEN_SECRET,
        {
          algorithms: ["HS512"],
        },
        (err, decoded) => {
          if (err || !decoded) {
            return;
          }

          if (typeof decoded !== "string") {
            if (decoded?.sub) {
              ws.getUserData().id = decoded.sub;
            }
            if (decoded?.username) {
              ws.getUserData().username = decoded.username;
            }
          }
        }
      );
      if (ws.getUserData().username && ws.getUserData().id) {
        handler.handle(message, ws);
      } else {
        ws.send(
          JSON.stringify(newErrorResponseMessage(message.id, "Unauthorized"))
        );
        return;
      }
    },
  };
};
