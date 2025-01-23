"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

const steps = [
  {
    title: "Create or join a server",
    description: "Choose whether you want to create a new server or join an existing one.",
  },
  {
    title: "Create a server",
    description: "Set up your new server with a name and optional image.",
  },
  {
    title: "Join a server",
    description: "Enter an invite link to join an existing server.",
  },
]


export const CreateProjectButton = () => {

  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0))
  }

  const closeModal = () => {
    setOpen(false)
    setStep(0)
  }


  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open)
        setStep(0)
      }}
    >
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Create New Project
          </DialogTitle>
          <DialogDescription>
            Create a new project to start with your team.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-hidden">
          {step === 0 && <StepOne nextStep={nextStep} closeModal={closeModal} />}
          {step === 1 && <CreateProject changeStep={setStep} />}
          {/* {step === 1 && <StepTwo prevStep={prevStep} closeModal={closeModal} />} */}
          {/* {step === 2 && <StepThree closeModal={closeModal} />} */}
        </div>
      </DialogContent>
    </Dialog>
  )
}

const CreateProject = ({changeStep}: {changeStep :(step: number) => void}) => {
  return (
    <div className="flex flex-col gap-2">
      <Button>
        Import from GitHub
      </Button>
      <Button>
        Create new repository
      </Button>
    </div>
  )
}


function StepOne({ nextStep, closeModal }: { nextStep: () => void; closeModal: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => nextStep()}>Create a Project</Button>
      <Button
        onClick={() => {
          nextStep()
          nextStep()
        }}
      >
        Join a Project
      </Button>
      <DialogFooter>
        <Button variant="secondary" onClick={closeModal}>
          Cancel
        </Button>
      </DialogFooter>
    </div>
  )
}

function StepTwo({ prevStep, closeModal }: { prevStep: () => void; closeModal: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <input type="text" placeholder="Server name" className="border p-2 rounded" />
      <Button onClick={closeModal}>Create Project</Button>
      <Button variant="secondary" onClick={prevStep}>
        Back
      </Button>
    </div>
  )
}

function StepThree({ closeModal }: { closeModal: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <input type="text" placeholder="Enter invite link" className="border p-2 rounded" />
      <Button onClick={closeModal}>Join Server</Button>
      <Button variant="secondary" onClick={closeModal}>
        Back
      </Button>
    </div>
  )
}
