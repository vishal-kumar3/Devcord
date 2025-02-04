import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import Image from "next/image"
import { User } from "@prisma/client"

type DMButtonProps = {
  name: string
  image: string
  href: string
  loggedUser?: User
}

export const DMButton = ({ name, image, href, loggedUser }: DMButtonProps) => {
  return (
    <Link href={href} className="py-1 px-3 flex justify-between items-center rounded-lg hover:bg-white hover:bg-opacity-10 text-neutral-400 hover:text-neutral-300 font-semibold text-base transition-all ease-in">
      <div className="flex items-center gap-2">
        <Avatar
          className="size-[40px]"
        >
          <AvatarImage src={image} alt={''} />
          <AvatarFallback>{''}</AvatarFallback>
        </Avatar>
        <div>{name.replace(loggedUser?.username || "", "")}</div>
      </div>
      <button className="min-w-[20px] min-h-[20px] flex justify-center items-center rounded-full bg-neutral-800 bg-opacity-70 hover:bg-neutral-700 hover:bg-opacity-70">
        <Image src="/icons/Close.svg" className="text-green-500" alt="x" width={20} height={20} />
      </button>
    </Link>
  )
}
