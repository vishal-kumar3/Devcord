import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { MessageWithSenderAndAttachments } from "@devcord/node-prisma/dist/types/message.types"

export type MessageContextMenuProps = {
  currentUser: string
  message: MessageWithSenderAndAttachments
  children: React.ReactNode
}


const MessageContextMenu = ({ message, currentUser, children }: MessageContextMenuProps) => {
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
        <ContextMenuItem>Subscription</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default MessageContextMenu
