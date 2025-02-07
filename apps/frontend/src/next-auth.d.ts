import { Prisma, SubscriptionStatus, SubscriptionType, User, UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";



export type ExtendedUser = DefaultSession["user"] & {
  name: string
  email: string
  id: string
  role: UserRole
  username: string
  github_token: string
  bio: string
  avatar: string
}


declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}
