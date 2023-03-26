import { DateTime } from "luxon";

export interface UserInfo {
  id: string;
  username: string;
  position: Location;
  radiusOfInterestMeters: number;
}

export interface ChatMessage {
  id: string;
  clientId: string;
  sender: Sender;
  sentAt: DateTime;
  receivedAt: DateTime;
  content: string;
  position: Location;
}

export interface Location {
  lat: number;
  long: number;
}

export interface Sender {
  id: string;
  username: string;
}
