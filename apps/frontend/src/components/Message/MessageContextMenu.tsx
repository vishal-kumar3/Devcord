import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { MessageWithSenderAndAttachments } from "@devcord/node-prisma/dist/types/message.types"
import { Dispatch, SetStateAction } from "react"

export type MessageContextMenuProps = {
  currentUser: string
  message: MessageWithSenderAndAttachments
  setEditing: Dispatch<SetStateAction<boolean>>
  children: React.ReactNode
}


const MessageContextMenu = ({ message, currentUser, setEditing, children }: MessageContextMenuProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent
        className="bg-back-one"
      >
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem>Billing</ContextMenuItem>
        <ContextMenuItem>Team</ContextMenuItem>
        <ContextMenuItem
          onClick={() => setEditing(true)}
        >Edit Message</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default MessageContextMenu
