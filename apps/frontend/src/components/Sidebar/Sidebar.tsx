import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "../ui/separator"

const Sidebar = () => {

  // fetch projects from the user
  const project: ProjectLinkProps[] = [
    {
      id: "2",
      name: "DevChat",
      image: "/images/discord.jpg",
      channel: "2"
    },
    {
      id: "1",
      name: "DevCord",
      image: "/images/devcord.jpg",
      channel: "1",
    }
  ]

  return (
    <div className="bg-neutral-800 sticky top-0 flex flex-col gap-3 items-center py-2 h-screen w-[75px]">
      {/* Ye button ka link update krte rehna h jaise last dm pe shift ho jana chahiye */}
      <ProjectLink
        project={{
          id: "",
          name: "DM",
          image: "/images/devcord.jpg",
        }}
      />
      <Separator className="w-[50%] bg-neutral-700" orientation="horizontal" decorative={true} />
      {
        project.map((project) => (
          <ProjectLink key={project.id} project={project} />
        ))
      }
      <button className="size-[60px] group hover:bg-blue-500 bg-neutral-700 rounded-[50%] hover:rounded-[35%] transition-all ease-linear duration-150 delay-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={35}
          height={35}
          color={"#000000"}
          fill={"none"}
          className="mx-auto text-blue-500 group-hover:text-neutral-700 transition-all ease-linear duration-150 delay-0"
        >
          <path d="M12 4V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

type ProjectLinkProps = {
  id: string
  name: string
  image: string
  channel?: string
}

const ProjectLink = ({ project }: { project: ProjectLinkProps }) => {
  // WIP: If project is selected then do some styling stuff
  // do useSearchParam and make this as individual client component
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative group w-full">
            <div className="h-[10px] group-hover:h-[50%] transition-all ease-linear absolute top-[50%] -translate-x-[50%] -translate-y-[50%] z-50 w-[10px] bg-white rounded-full" />
            <Link href={!project.channel ? `/p` : `/p/projects/${project.id}/${project.channel}`} className="rounded-[50%] hover:rounded-[35%]">
              <Avatar
                className="size-[60px] mx-auto rounded-[50%] hover:rounded-[35%] transition-all ease-linear duration-150 delay-0"
              >
                <AvatarImage src={project.image} alt={project.name} />
                <AvatarFallback>{project.name}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" >
          <p className="text-base">{project.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Sidebar
