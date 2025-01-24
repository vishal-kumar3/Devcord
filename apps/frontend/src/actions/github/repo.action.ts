"use server"
import axios from "axios"
import { prisma } from "../../db/prisma"
import { cache } from "react"
import { ErrorHandler } from "../../utils/ErrorHandler"


export const token = cache(async (id: string = "cm66369pi0000cpyhpsh2ialn") => {
  const user = await prisma.user.findUnique({
    where: {
      id: "cm66369pi0000cpyhpsh2ialn"
    }
  }).catch(err => {
    console.log(err.stack)
    return { error: "User not found", github_token: null }
  })

  return { error: null, github_token: user?.github_token }
})


export const getAllRepo = async (id: string, page: number) => {

  const user = await token()

  if (!user) return { error: "User not found", data: null }

  try {
    const repo = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${user?.github_token}`
      },
      params: {
        sort: 'updated',
        per_page: 100,
        page: page
      }
    })
    console.log("All Repo:- ", repo.data)
    return { error: null, data: repo.data }
  } catch (error) {
    return ErrorHandler(error)
  }
}


export const createRepo = async (id: string, name: string, description: string, visibility: boolean = true) => {
  if(!name || !description) return { error: "Name and description are required", data: null }
  const user = await token()

  if (user.error) return { error: user.error, data: null }

  try {
    const repo = await axios.post("https://api.github.com/user/repos", {
      name: name,
      description: description,
      private: !visibility,
    }, {
      headers: {
        Authorization: `Bearer ${user?.github_token}`
      }
    })

    console.log("Created Repo:- ", repo.data)
    return { error: null, data: repo.data }
  } catch (error) {
    return ErrorHandler(error)
  }
}

export const getUserById = async (id: string = "cm66369pi0000cpyhpsh2ialn") => {
  const user = await prisma.user.findUnique({
    where: {
      id: id
    }
  }).catch(err => {
    console.log(err.stack)
    return { error: "User not found", user: null }
  })

  return { error: null, user: user}
}


export const deleteRepo = async (id: string, repo: string) => {
  const user = await token()

  if (user.error) return { error: user.error, data: null }

  try {
    const repo = await axios.delete(`https://api.github.com/repos/${user?.user?.github_username}/${repo}`, {
      headers: {
        Authorization: `Bearer ${user?.github_token}`
      }
    })

    console.log("Deleted Repo:- ", repo.data)
    return { error: null, data: repo.data }
  } catch (error) {
    return ErrorHandler(error)
  }
}
