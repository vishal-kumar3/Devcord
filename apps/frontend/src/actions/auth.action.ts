"use server"
import { auth } from "@/auth"
import { Messages } from "@/utils/enums"
import { cache } from "react"

export const getAuthUser = cache(async () => {
  const session = await auth()
  if(!session) return null
  return session
})
