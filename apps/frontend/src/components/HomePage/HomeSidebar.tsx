import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"


const HomeSidebar = () => {
  return (
    <div className="bg-neutral-700 h-screen flex flex-col p-2">
      {/* WIP: Searchbar will be here */}
      HomeSidebar
      <DMButton />
    </div>
  )
}

const DMButton = () => {
  return (
    <Link href={'/'} className="py-1 px-3 flex justify-between items-center rounded-lg hover:bg-white hover:bg-opacity-10 text-neutral-400 hover:text-neutral-300 font-thin text-lg transition-all ease-in">
      <div className="flex items-center gap-2">
        <Avatar
          className="size-[40px]"
        >
          <AvatarImage src={''} alt={''} />
          <AvatarFallback>{''}</AvatarFallback>
        </Avatar>
        <div className="">Name Here</div>
      </div>
      <button className="relative z-50 hover:bg-red-500">
        X
      </button>
    </Link>
  )
}

export default HomeSidebar
