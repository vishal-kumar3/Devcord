"use server"

import axios from "axios"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"


export const login = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/auth/github`)
  const {github_state, redirect_url} = res.data

  const cookieStore = await cookies();
  cookieStore.set("github_oauth_state", github_state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax"
  });
  
  redirect(redirect_url)
}
