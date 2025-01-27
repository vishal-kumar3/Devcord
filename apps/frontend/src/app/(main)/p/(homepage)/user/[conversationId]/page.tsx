import Chat from "@/components/Chat/chat";
import { getLoggedInUser } from "@/actions/user.action";
import { notFound } from "next/navigation";
import { getConversationAndUserById } from "@/actions/conversation.action";
import { ConversationWithMembers } from "@/types/conversation.type";

// app/projects/[id]/page.tsx
export default async function Page({
  params
}: {
  params: Promise<{ conversationId: string }>;
  }) {
  const { conversationId } = await params

  const loggedUser = await getLoggedInUser()
  if (!loggedUser) return notFound()

  const {data, error} = await getConversationAndUserById(conversationId)
  if (error) return notFound()

  const conversation = data?.conversation as ConversationWithMembers
  if (!conversation) return notFound()

  return (
    <div className="w-full">
      <Chat conversationId={conversationId} conversation={conversation} user={loggedUser} />
    </div>
  );
}
