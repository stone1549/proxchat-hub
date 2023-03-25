import { DateTime } from "luxon";

export interface AuthInfo {
  id: string;
  username: string;
}

export interface ChatMessage {
  id: string;
  clientId: string;
  sender: Sender;
  sentAt: DateTime;
  receivedAt: DateTime;
  content: string;
  location: Location;
}

export interface Location {
  lat: number;
  long: number;
}

export interface Sender {
  id: string;
  username: string;
}
