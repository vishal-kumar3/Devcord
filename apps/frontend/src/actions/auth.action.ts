import { auth } from "@/auth"
import { CustomError } from "@/utils/ErrorHandler"
import { cache } from "react"

export const getAuthUser = cache(async () => {
  const session = await auth()
  if(!session) throw new CustomError(Messages.USER_NOT_FOUND, STATUS.NOT_FOUND)
  
  return session.user
})
