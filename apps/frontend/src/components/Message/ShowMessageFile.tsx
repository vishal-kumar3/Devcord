import { cn } from "@/lib/cn"
import { Attachment } from "@prisma/client"
import Image from "next/image"
import { Dispatch, SetStateAction } from "react"


export type ShowMessageFileProps = {
  attachment: Attachment
  isEditOn: boolean
  onSelecteFile: () => void
  setDeleteFiles: Dispatch<SetStateAction<string[]>>
  className?: string
  children: React.ReactNode
}

export const ShowMessageFile = ({ attachment, isEditOn, onSelecteFile, setDeleteFiles, className, children }: ShowMessageFileProps) => {
  return (
    <div
      onClick={onSelecteFile}
      className={cn(
        "relative h-[220px] w-[220px] overflow-hidden",
        className
      )}
    >
      {
        isEditOn && (
          <div className="flex absolute top-2 right-2 items-center">
            <Image
              src='/icons/Delete.svg'
              alt={attachment.filename}
              onClick={() => setDeleteFiles((prev) => [...prev, attachment.id])}
              className="object-cover rounded-md cursor-pointer aspect-square hover:bg-neutral-600"
              width={30}
              height={30}
            />
          </div>
        )
      }
      {children}
    </div>
  )
}

export const ShowMessageImage = ({ attachment }: { attachment: Attachment }) => {
  return (
    <Image
      src={attachment.url}
      alt={attachment.filename}
      className="object-cover cursor-pointer rounded-xl h-full w-full"
      width={attachment.width!}
      height={attachment.height!}
    />
  )
}

export const ShowMessageVideo = ({ attachment }: { attachment: Attachment }) => {
  return (
    <video
      className="object-cover cursor-pointer rounded-xl h-full w-full"
      width={350}
      height={350}
      controls
    >
      <source
        src={attachment.proxyUrl}
        type={attachment.contentType}
        height={attachment.height!}
        width={attachment.width!}
      />
    </video>
  )
}

export const ShowOtherFiles = ({ attachment, isEditing }: { attachment: Attachment, isEditing: boolean }) => {
  return (
    <div className="group/inner bg-neutral-800/40 hover:bg-neutral-800/60 rounded-xl w-full h-full">
      <div className="text-text-muted px-2 w-full h-full flex items-center">{attachment.filename}</div>
      {
        !isEditing && (
          <div className="opacity-0 group-hover/inner:opacity-100 absolute bg-neutral-400 rounded-sm transition-all ease-in-out top-1 right-2 size-7">
            <Image
              src='/icons/File_Download.svg'
              alt={attachment.filename}
              onClick={() => window.open(attachment.url, '_blank')}
              className="object-cover rounded-sm cursor-pointer aspect-square hover:bg-neutral-500"
              width={30}
              height={30}
            />
          </div>
        )
      }
    </div>
  )
}
