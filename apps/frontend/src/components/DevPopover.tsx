import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Image from "next/image"
import React from "react"

export const DevPopover = ({
  title,
  description,
  Main,
  Footer
}: {
  title?: string
  description?: string
  Main?: React.ReactNode
  Footer?: React.ReactNode
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <Image src="/icons/Plus.svg" alt="+" width={20} height={20} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[400px]" side="right" align="start">
        <div className="p-4 pb-0">
          <header>
            <h1 className="font-bold text-lg">{title || "Title"}</h1>
            <h4 className="text-sm">{description || "Description"}</h4>
          </header>
          {Main || <p>Main</p>}
        </div>
        <footer className="bg-back-one w-full p-4">
          {Footer || <p>Footer</p>}
        </footer>
      </PopoverContent>
    </Popover>
  )
}
