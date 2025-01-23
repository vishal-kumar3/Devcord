"use server"

import { OAuth2Tokens } from "arctic";
import { prisma } from "../db/prisma";
import { cookies } from "next/headers";
import { cache } from "react";

export const createUser = async (githubId: string, githubUsername: string, tokens: OAuth2Tokens) => {
  if (!githubId || !githubUsername || !tokens) return null;

  const user = await prisma.user.create({
    data: {
      githubId: `${githubId}`,
      github_username: `${githubUsername}`,
      username: `${githubUsername}`,
      github_token: tokens.accessToken(),
    }
  }).catch((err) => {
    console.error(err.stack)
    return null;
  })

  return user;
}

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
  const cookie = await cookies()
  const session = cookie.get('session')

  if(!session) return null

  const loggedUser = await prisma.session.findUnique({
    where: {
      id: session?.value
    },
    select: {
      user: true
    }
  }).catch(err => {
    console.error("Error while fetching loggedin usser")
    return null
  })

  return loggedUser?.user
})

export const searchByUsername = async ({username, page=0}: {username: string, page: number}) => {

  if(!username || username === "") return null;

  const loggedUser = await getLoggedInUser()

  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: username
      },
      NOT: {
        id: loggedUser?.id
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
