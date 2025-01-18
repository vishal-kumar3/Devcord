import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { FaGithub } from "react-icons/fa";
import { login } from "@/actions/auth.action";

const page = () => {
  return (
    <div className="grid place-items-center h-screen">
      <Card className="grid place-items-center w-[360px]">
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
        <CardContent>
          <form action={async () => {
            "use server"
            const res = await login()
            console.log("Login info:- ", res)
          }}>
            <Button
              className="text-center w-full text-lg"
              type="submit"
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

export default page
