"use server"


export const login = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/github`, {})
  console.log(res)
}
