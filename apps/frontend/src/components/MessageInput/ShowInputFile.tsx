import Image from "next/image"

export type InputFileProps = {
  index: number
  file: File
  handleDeleteImage: (index: number) => void
}

export type ShowInputFilesProps = {
  files: FileList | null
  handleDeleteImage: (index: number) => void
}

export const ShowInputFiles = ({ files, handleDeleteImage }: ShowInputFilesProps) => {
  return (
    <>
      {
        (files && files.length > 0) && Array.from(files).map((file, index) => {
          const fileType = file.type.split("/")

          return (
            <ShowFile
              key={index}
              index={index}
              file={file}
              handleDeleteImage={handleDeleteImage}
              ShowInput={
                fileType[0] === "image" ? (
                  <ShowInputImage file={file} />
                ) : fileType[0] === "video" ? (
                  <ShowInputVideo file={file} />
                ) : (
                  <div>File</div>
                )
              }
            />
          )
        })
      }
    </>
  )
}

export const ShowFile = (
  { index, file, handleDeleteImage, ShowInput }
    :
    InputFileProps & {
      ShowInput: React.ReactNode
    }
) => {
  return (
    <div
      className="relative flex flex-col bg-back-two p-2 rounded-xl justify-center min-w-[300px]"
      key={index}
    >
      <div className="absolute top-3 right-3 bg-back-one p-1 px-2 flex gap-2">
        <button
          onClick={() => handleDeleteImage(index)}
        >X</button>
      </div>
      {ShowInput}
      <span className="line-clamp-1">
        {file.name}
      </span>
    </div>
  )
}

export const ShowInputImage = ({ file }: { file: File }) => {
  return (
    <Image
      src={URL.createObjectURL(file)}
      alt={file.name}
      className="rounded-xl px-2 h-[250px] w-[300px] object-contain"
      width={350}
      height={350}
    />
  )
}

export const ShowInputVideo = ({ file }: { file: File }) => {
  return (
    <video
      className="rounded-xl px-2 h-[250px] w-[300px] object-contain"
      width={350}
      height={350}
      controls
    >
      <source
        src={URL.createObjectURL(file)}
        type={file.type}
      />
    </video>
  )
}

export const ShowInputEmbed = ({ file }: { file: File }) => {
  return (
    <div>
      {file.name}
      {file.type}
    </div>
  )
}
