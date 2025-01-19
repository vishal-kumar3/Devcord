import { Session, User } from "@prisma/client";

export enum AuthResponseMsg {
  InvalidRequest = "Invalid Request",
  InvalidClientCredentials = "Invalid Client Credentials",
  InternalServerError = "Internal Server Error",
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
