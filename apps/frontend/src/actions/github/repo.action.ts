"use server"
import axios from "axios"
import { getAuthUser } from "../auth.action";

export const getAllRepo = async (id: string, page: number) => {
  const session = await getAuthUser()
  if (!session) return { error: "User not found", data: null }
  const user = session.user
  try {
    const repo = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${user.github_token}`
      },
      params: {
        sort: 'updated',
        per_page: 100,
        page: page
      }
    })
    return { error: null, data: repo.data }
  } catch (error) {
    console.error("Error while fetching all repo:- ", error)
    return null
  }
}


export const createRepo = async (id: string, name: string, description: string, visibility: boolean = true) => {
  if(!name || !description) return { error: "Name and description are required", data: null }
  const session = await getAuthUser()
  if(!session) return null
  const user = session.user

  try {
    const repo = await axios.post("https://api.github.com/user/repos", {
      name: name,
      description: description,
      private: !visibility,
    }, {
      headers: {
        Authorization: `Bearer ${user.github_token}`
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


export const deleteRepo = async (id: string, repo: string) => {
  const session = await getAuthUser()
  if(!session) return null
  const user = session.user

  try {
    const deletedRepo = await axios.delete(`https://api.github.com/repos/${user.username}/${repo}`, {
      headers: {
        Authorization: `Bearer ${user.github_token}`
      }
    })

    return { error: null, data: deletedRepo.data }
  } catch (error) {
    console.error("Error while deleting repo:- ", error)
    return null
    // return ErrorHandler(error)
  }
}
