import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const Sidebar = () => {

  // fetch projects from the user
  const project: ProjectButtonProps = {
    id: "1",
    name: "DevCord",
    image: "devcord.jpg",
  }

  return (
    <div className="bg-slate-500 sticky top-0 flex flex-col items-center py-2 h-screen w-[90px]">

      <ProjectButton project={project} />
    </div>
  )
}

type ProjectButtonProps = {
  id: string
  name: string
  image: string
}

const ProjectButton = ({ project }: { project: ProjectButtonProps }) => {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/project/${project.id}`} className="mx-auto">
            <Avatar
              className="size-[60px] rounded-[50%] hover:rounded-[35%] transition-all ease-linear duration-150 delay-0"
            >
              <AvatarImage src={project.image} alt={project.name} />
              <AvatarFallback>{project.name}</AvatarFallback>
            </Avatar>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" >
          <p className="text-base">{project.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Sidebar
