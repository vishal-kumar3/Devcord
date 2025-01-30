import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { FaGithub } from "react-icons/fa";
import ErrorCard from "./ErrorCard";
import { Suspense } from "react";
import { signIn } from "../../../auth";
import { DEFAULT_LOGIN_REDIRECT } from "../../../routes";

const AuthPage = () => {
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
          <Suspense>
            <ErrorCard />
          </Suspense>
          <form action={async () => {
            "use server"
            await signIn("github", { redirectTo: DEFAULT_LOGIN_REDIRECT });
          }}>
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
