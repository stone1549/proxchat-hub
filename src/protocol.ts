import { UserInfo, ChatMessage, Location } from "./domain.js";
import { DateTime } from "luxon";
import { randomUUID } from "crypto";

export enum ClientMessageType {
  Handshake = "Handshake",
  SendChatMessage = "SendChatMessage",
  UpdateState = "UpdateState",
}

export enum ServerMessageType {
  HandshakeResponse = "HandshakeResponse",
  ChatMessageNotification = "ChatMessageNotification",
  ErrorResponse = "ErrorResponse",
}

export interface ClientPayload {
  type: keyof typeof ClientMessageType;
}

export interface ServerPayload {
  type: keyof typeof ServerMessageType;
}

export interface ClientMessage<PAYLOAD extends ClientPayload> {
  id: string;
  token: string;
  payload: PAYLOAD;
}

export interface ServerMessage<PAYLOAD extends ServerPayload> {
  id: string;
  payload: PAYLOAD;
}

export interface ClientHandshakeMessage
  extends ClientMessage<{
    type: ClientMessageType.Handshake;
    position: Location;
    radius: number;
  }> {}

export const isClientHandshakeMessage = (
  message: ClientMessage<ClientPayload>
): message is ClientHandshakeMessage => {
  return message.payload.type === ClientMessageType.Handshake;
};

export interface HandshakeResponseMessage
  extends ServerMessage<{
    type: ServerMessageType.HandshakeResponse;
    error?: string;
  }> {}

export const newHandshakeResponseMessage: (
  id: string,
  error?: string
) => HandshakeResponseMessage = (id, error) => {
  return {
    id,
    payload: {
      type: ServerMessageType.HandshakeResponse,
      error,
    },
  };
};

export interface ClientSendChatMessage
  extends ClientMessage<{
    type: ClientMessageType.SendChatMessage;
    clientId: string;
    content: string;
    position: Location;
    sentAt: DateTime;
  }> {}

export const isClientSendChatMessage = (
  message: ClientMessage<ClientPayload>
): message is ClientSendChatMessage => {
  return message.payload.type === ClientMessageType.SendChatMessage;
};

export interface ChatMessageNotificationMessage
  extends ServerMessage<{
    type: ServerMessageType.ChatMessageNotification;
    message: ChatMessage;
  }> {}

export const newChatMessageNotificationMessage = (
  auth: UserInfo,
  id: string,
  clientId: string,
  content: string,
  position: Location,
  sentAt: DateTime
) => {
  return {
    id: randomUUID(),
    payload: {
      type: ServerMessageType.ChatMessageNotification,
      message: {
        id,
        clientId,
        content,
        sender: {
          id: auth.id,
          username: auth.username,
        },
        position,
        sentAt,
        receivedAt: DateTime.utc(),
      },
    },
  } as ChatMessageNotificationMessage;
};

export interface ClientUpdateStateMessage
  extends ClientMessage<{
    type: ClientMessageType.UpdateState;
    position: Location;
    radius: number;
  }> {}

export const isClientUpdateStateMessage = (
  message: ClientMessage<ClientPayload>
): message is ClientUpdateStateMessage => {
  return message.payload.type === ClientMessageType.UpdateState;
};

export interface ErrorResponseMessage
  extends ServerMessage<{
    type: ServerMessageType.ErrorResponse;
    code: number;
    error: string;
  }> {}

export const newErrorResponseMessage: (
  id: string,
  code: number,
  error: string
) => ErrorResponseMessage = (id, code, error) => {
  return {
    id,
    payload: {
      type: ServerMessageType.ErrorResponse,
      code,
      error,
    },
  };
};
