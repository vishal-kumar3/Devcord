"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { FaGithub } from "react-icons/fa";
import { login } from "@/actions/auth.action";
import { useSearchParams } from "next/navigation";
import { AuthResponseMsg } from "@/types/auth.type";
import { CiWarning } from "react-icons/ci";

const AuthPage = () => {
  const query = useSearchParams()
  const error = query.get("error")

  const isValidError = (error: string | null): error is AuthResponseMsg => {
    return Object.values(AuthResponseMsg).includes(error as AuthResponseMsg);
  };

  return (
    <div className="grid place-items-center h-screen">
      <Card className="grid place-items-center w-[360px] bg-white text-black">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Auth Page</CardTitle>
          <CardDescription className="text-xl">Auth content</CardDescription>
          <Image
            src="/images/devcord.jpg"
            width={150}
            height={150}
            alt="Devcord Image"
            className="rounded-full"
          />
        </CardHeader>
        <CardContent className="space-y-3">
          {error && isValidError(error) && (
            <div
              className="w-full border border-destructive bg-destructive/20 p-3 rounded-md flex gap-2 items-center justify-center text-destructive font-bold text-md"
            >
              <CiWarning className="text-2xl" />
              {error}
            </div>
          )}
          <form action={login}>
            <Button
              className="text-center w-full text-lg text-white"
              type="submit"
              variant="outline"
            >
              <FaGithub />
              Continue With Github
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthPage
