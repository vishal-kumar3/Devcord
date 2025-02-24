import { Attachment } from "@prisma/client"
import Image from "next/image"
import { Dispatch, SetStateAction } from "react"


export type ShowMessageFileProps = {
  attachment: Attachment
  isEditOn: boolean
  setDeleteFiles: Dispatch<SetStateAction<string[]>>
  children: React.ReactNode
}

export const ShowMessageFile = ({ attachment, isEditOn, setDeleteFiles, children }: ShowMessageFileProps) => {
  return (
    <div className="relative h-[220px] w-[220px] overflow-hidden">
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
