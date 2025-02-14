import { createOrGetDMConversation, removeMemberFromConversation } from "@/actions/conversation.action"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useSocket } from "@/providers/socket.provider"
import { SOCKET_CONVERSATION } from "@devcord/node-prisma/dist/constants/socket.const"
import { UserConversationWithUser } from "@devcord/node-prisma/dist/types/userConversation.types"
import { Session } from "next-auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// WIP: Implement other context menu items

export function MembersContextMenu({ children, member, session, adminUser }: { children: React.ReactNode, member: UserConversationWithUser, session: Session, adminUser: UserConversationWithUser | null }) {
  const { socket } = useSocket()
  const router = useRouter()

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem
          inset
        >
          Profile
        </ContextMenuItem>
        {
          member.userId !== session.user.id && (
            <>
              <ContextMenuItem
                inset
                onClick={async () => {
                  const conversation = await createOrGetDMConversation(member.userId, member.user.username)
                  if (!conversation) return toast.error("Failed to create conversation")
                  return router.push(`/p/user/${conversation.id}`)
                }}
              >
                Message
              </ContextMenuItem>
              <ContextMenuItem inset>
                Call
              </ContextMenuItem>
              <ContextMenuItem inset>
                Remove Friend
              </ContextMenuItem>
              { session.user.id === (adminUser?.userId ?? false) &&
                <>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    onClick={async () => {
                      const { data, error } = await removeMemberFromConversation({
                        conversationId: member.conversationId,
                        userId: member.userId
                      })
                      if (!data) {
                        return toast.error(error)
                      }

                      socket?.emit(SOCKET_CONVERSATION.REMOVE_MEMBERS, {
                        conversationId: member.conversationId,
                        members: [member.userId]
                      })
                      return toast.success("User removed from group")

                    }}
                    className="text-red-400 hover:text-red-500"
                    inset
                  >
                    Remove From Group
                  </ContextMenuItem>
                  <ContextMenuItem className="text-red-400 hover:text-red-500" inset>
                    Make Group Owner
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                </>
              }
            </>
          )
        }
      </ContextMenuContent>
    </ContextMenu>
  )
}
