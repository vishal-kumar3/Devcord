"use server"

import { login } from "@/actions/auth.action"



const page = async () => {
  return (
    <div>
      page
      <form action={await login}>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default page
