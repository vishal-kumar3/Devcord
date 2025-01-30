"use server"
import { auth } from '@/auth';
import { prisma } from '@devcord/node-prisma';
import { cache } from "react";

export const getUserFromGithubId = async (githubId: string) => {
  if (!githubId) return null;

  const user = await prisma.user.findUnique({
    where: {
      githubId: `${githubId}`
    }
  }).catch((err) => {
    console.error(err.stack)
    return null;
  })


  return user;
}

export const getLoggedInUser = cache(async () => {
  const session = await auth()

  if(!session) return null

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
export const searchByUsername = async ({username, page=0}: {username: string, page: number}) => {

  if(!username || username === "") return null;

  const session = await auth()

  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: username
      },
      NOT: {
        id: session?.user?.id
      }
    },
    take: 10,
    skip: page * 10,
  }).catch((err) => {
    console.error(err.stack)
    return null;
  })

  return users;
}
