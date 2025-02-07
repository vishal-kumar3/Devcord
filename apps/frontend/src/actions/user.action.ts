"use server"
import { prisma } from '@devcord/node-prisma';
import { cache } from "react";
import { getAuthUser } from './auth.action';

export const getLoggedInUser = cache(async () => {
  const session = await getAuthUser()

  if (!session) return null

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id
    }
  }).catch(err => {
    console.error("Error while fetching loggedin usser:- ", err.stack)
    return null
  })

  return user
})

export const searchByUsernameForConversation = async ({ username, restrictedUser = [], page = 0 }: { username: string, page: number, restrictedUser?: string[] }) => {

  if (!username || username.trim() === "") return null;

  const session = await getAuthUser();
  if (!session) return null;

  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: username,
      },
      NOT: {
        id: {
          in: [session?.user?.id, ...restrictedUser]
        },
      },
    },
    take: 10,
    skip: page * 10,
  }).catch((err) => {
    console.error(err.stack);
    return null;
  });

  return users;
}

export const getUserByUsername = async (username: string) => {
  if (!username || username.trim() === "") return null;

  const session = await getAuthUser();
  if (!session) return null;

  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: 'insensitive'
      },
      NOT: {
        id: {
          equals: session.user.id,
        },
      }
    },
  }).catch((err) => {
    console.error(err.stack);
    return null;
  });

  return user;
}
