import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "../ui/separator"
import { CreateProjectButton } from "./CreateProjectButton"

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
    <div className="bg-back-one sticky top-0 flex flex-col gap-3 items-center py-2 h-screen min-w-miniSidebar">
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
      <CreateProjectButton />
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
  // WIP: do useSearchParam and make this as individual client component
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
        <TooltipContent side="right">
          <p className="text-base">{project.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Sidebar
