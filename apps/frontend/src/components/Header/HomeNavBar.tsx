import Image from "next/image"
import { Separator } from "../ui/separator"

const HomeNavBar = () => {
  return (
    <div className={`flex justify-between items-center px-4 border-b border-divider bg-back-three min-h-nav`}>
      <div className="flex items-center gap-2">
        <Image src="/icons/Friends.svg" alt="logo" width={35} height={35} />
        <p className="">Friends</p>
        <Separator orientation="vertical" decorative={true} />
        <NavButton name="Online" />
        <NavButton name="All" />
        <NavButton name="Pending" />
        <NavButton name="Add Friend" />
      </div>
    </div>
  )
}

const NavButton = ({name}: {name: string}) => {
  return (
    <button className="hover:bg-neutral-500 rounded-lg px-2 py-1">{name}</button>
  )
}

export default HomeNavBar
