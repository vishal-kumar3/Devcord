"use server"

import { prisma } from "../db/prisma";

export const createUser = async (githubId: string, githubUsername: string) => {
  if (!githubId || !githubUsername) return null;

  const user = await prisma.user.create({
    data: {
      githubId: `${githubId}`,
      username: `${githubUsername}`
    }
  }).catch((err) => {
    console.error(err)
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
