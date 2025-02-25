import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { MessageWithSenderAndAttachments } from "@devcord/node-prisma/dist/types/message.types"
import { User } from "@prisma/client"
import { Dispatch, SetStateAction } from "react"

export type MessageContextMenuProps = {
  currentUser: User
  message: MessageWithSenderAndAttachments
  setEditing: () => void
  onDelete: () => void
  children: React.ReactNode
}


const MessageContextMenu = ({ message, currentUser, setEditing, onDelete, children }: MessageContextMenuProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent
        className="bg-back-one"
      >
        <ContextMenuItem>Profile</ContextMenuItem>
        {
          message.senderId === currentUser.id &&
          <>
            <ContextMenuItem
              onClick={() => setEditing()}
            >Edit Message</ContextMenuItem>
            <ContextMenuItem
              onClick={() => onDelete()}
            >Delete Message</ContextMenuItem>
          </>
        }
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default MessageContextMenu
