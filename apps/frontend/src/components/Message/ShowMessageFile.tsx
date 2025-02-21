import { Attachment } from "@prisma/client"
import Image from "next/image"


export const ShowMessageImage = ({ attachment }: { attachment: Attachment }) => {
  return (
    <Image
      src={attachment.url}
      alt={attachment.filename}
      className="object-cover cursor-pointer rounded-xl h-[200px] w-[200px]"
      width={attachment.width!}
      height={attachment.height!}
    />
  )
}

export const ShowMessageVideo = ({ attachment }: { attachment: Attachment }) => {
  return (
    <div className="max-h-[300px] overflow-hidden">
      <video
        className="object-cover cursor-pointer rounded-xl h-[200px] w-[200px]"
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
    </div>
  )
}
