import { auth } from "@/auth"
import { Messages } from "@/utils/enums"
import { cache } from "react"

export const getAuthUser = cache(async () => {
  const session = await auth()
  if(!session) throw new Error(Messages.USER_NOT_FOUND)
  
  return session.user
})
