import { Session, User } from "@prisma/client";

export enum AuthResponseMsg {
  InvalidRequest = "Invalid Request",
  InvalidClientCredentials = "Invalid Client Credentials",
  InternalServerError = "Internal Server Error",
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };


export type UserPayload = {
  id: number;
  email: string;
  username: string;
  role: string;
  accessToken: string;
}
