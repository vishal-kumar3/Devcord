"use server"
import axios from "axios"
import { prisma } from "../../db/prisma"
import { cache } from "react"
// import { ErrorHandler } from "../../utils/ErrorHandler"


export const token = cache(async (id: string = "cm66369pi0000cpyhpsh2ialn") => {
  const user = await prisma.user.findUnique({
    where: {
      id: "cm66369pi0000cpyhpsh2ialn"
    }
  }).catch(err => {
    console.log(err.stack)
    return null
  })

  return user
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
    console.error("Error while fetching all repo:- ", error)
    return null
  }
}


export const createRepo = async (id: string, name: string, description: string, visibility: boolean = true) => {
  if(!name || !description) return { error: "Name and description are required", data: null }
  const user = await token()
  if(!user) return null

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
    console.error("Error while creating repo:- ", error)
    return null
    // return ErrorHandler(error)
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
  if(!user) return null

  try {
    const deletedRepo = await axios.delete(`https://api.github.com/repos/${user.username}/${repo}`, {
      headers: {
        Authorization: `Bearer ${user?.github_token}`
      }
    })

    console.log("Deleted Repo:-", deleteRepo)
    return { error: null, data: deleteRepo }
  } catch (error) {
    console.error("Error while deleting repo:- ", error)
    return null
    // return ErrorHandler(error)
  }
}
