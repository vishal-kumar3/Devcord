import { Attachment } from "@prisma/client"
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import Image from "next/image";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export type AttachmentViewerProps = {
  attachments: Attachment[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const AttachmentViewer = ({ attachments, currentIndex, isOpen, onClose, onNavigate }: AttachmentViewerProps) => {

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return
      if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + attachments.length) % attachments.length)
      } else if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % attachments.length)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })


  if (currentIndex < 0 || currentIndex >= attachments.length) {
    return null;
  }
  const isThirdAttachment = !attachments[currentIndex].contentType.includes("image") && !attachments[currentIndex].contentType.includes("video") && !attachments[currentIndex].contentType.includes("audio")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-transparent border-none outline-none p-0 w-auto max-w-[90vw] h-[90vh] backdrop-blur-md"
      >
        <div className="relative flex items-center justify-center">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          {
            attachments[currentIndex].contentType.startsWith('image') && (
              <Image
                src={attachments[currentIndex].url}
                alt={attachments[currentIndex].filename}
                width={attachments[currentIndex].width || 800}
                height={attachments[currentIndex].height || 600}
                className="object-contain rounded-md max-h-[90vh] max-w-[90vw]"
              />
            )
          }
          {
            attachments[currentIndex].contentType.startsWith('video') && (
              <video
                src={attachments[currentIndex].url}
                width={attachments[currentIndex].width || 800}
                height={attachments[currentIndex].height || 600}
                controls
                className="object-contain rounded-md max-h-[90vh] max-w-[90vw]"
              />
            )
          }
          {
            attachments[currentIndex].contentType.startsWith('audio') && (
              <audio
                src={attachments[currentIndex].url}
                controls
                className="object-contain rounded-md max-h-[90vh] max-w-[90vw]"
              />
            )
          }
          {
            isThirdAttachment && (
              <a
                href={attachments[currentIndex].url}
                target="_blank"
                rel="noreferrer"
                download
                className="object-contain rounded-md max-h-[90vh] max-w-[90vw]"
              >
                <div>
                  {attachments[currentIndex].filename}
                </div>
              </a>
            )
          }
        </div>
        <div
          className="fixed inset-0 flex items-center justify-between pointer-events-none z-[60]"
        >
          {
            currentIndex !== 0 && (
              <button
                onClick={() => onNavigate((currentIndex - 1 + attachments.length) % attachments.length)}
                className="pointer-events-auto absolute bottom-0 right-1/2 rounded-md p-2 text-white bg-black hover:bg-gray-800 outline-none"
              >
                <ArrowLeft />
              </button>
            )
          }
          {
            currentIndex !== attachments.length - 1 && (
              <button
                onClick={() => onNavigate((currentIndex + 1) % attachments.length)}
                className="pointer-events-auto absolute bottom-0 left-1/2 rounded-md p-2 text-white bg-black hover:bg-gray-800 outline-none"
              >
                <ArrowRight />
              </button>
            )
          }
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AttachmentViewer
