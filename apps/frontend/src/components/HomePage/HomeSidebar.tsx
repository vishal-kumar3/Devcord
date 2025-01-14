import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Input } from "../ui/input"
import { cn } from "../../lib/utils"
import { nav } from "../../data/design"

const HomeSidebar = () => {
  return (
    <div className="relative bg-neutral-700 h-screen">
      {/* WIP: Searchbar will be here */}
      <div className={cn("flex justify-center items-center border-b-2 border-neutral-800 w-full", `h-[${nav.height}]`)}>
        <Input
          placeholder="Search"
          className="w-[90%] h-[70%] bg-neutral-800 border-none text-neutral-400"
        />
      </div>
      <div className="p-2 space-y-2">
        <div className="space-y-1">
          <DMButton name="Friends" image="" href="/p" />
          <DMButton name="Shop" image="" href="/p/store" />
        </div>
        <div className="space-y-1 text-sm">
          <div className="text-neutral-400 font-semibold">
            <p className="">DIRECT MESSAGE</p>
            {/* WIP: Add icon */}
          </div>
          <DMButton name="Vishal Kumar" image="" href="/p/user/1" />
          <DMButton name="Vishal Kumar" image="" href="/p/user/1" />
          <DMButton name="Vishal Kumar" image="" href="/p/user/1" />
        </div>
      </div>
      {/* My Account */}
      <div className="absolute bottom-0 w-full">
        <AccountCard />
      </div>
    </div>
  )
}

const AccountCard = () => {
  return (
    <div className="flex items-center gap-2 bg-neutral-800 bg-opacity-70 p-2">
      <Avatar
        className="size-[40px]"
      >
        <AvatarImage src={''} alt={''} />
        <AvatarFallback>{''}</AvatarFallback>
      </Avatar>
      <div className="">
        <p className="text-lg leading-none">Vishal Kumar</p>
        <p className="text-sm text-neutral-400 leading-none">Holla whatsuppp</p>
      </div>
      <div>
        {/* WIP: animated svg here:- mute, headphone, settings */}
      </div>
    </div>
  )
}

type DMButtonProps = {
  name: string
  image: string
  href: string
}

const DMButton = ({ name, image, href }: DMButtonProps) => {
  return (
    <Link href={href} className="py-1 px-3 flex justify-between items-center rounded-lg hover:bg-white hover:bg-opacity-10 text-neutral-400 hover:text-neutral-300 font-semibold text-base transition-all ease-in">
      <div className="flex items-center gap-2">
        <Avatar
          className="size-[40px]"
        >
          <AvatarImage src={image} alt={''} />
          <AvatarFallback>{''}</AvatarFallback>
        </Avatar>
        <div>{name}</div>
      </div>
      <button className="relative z-50 hover:bg-red-500">
        X
      </button>
    </Link>
  )
}

export default HomeSidebar
