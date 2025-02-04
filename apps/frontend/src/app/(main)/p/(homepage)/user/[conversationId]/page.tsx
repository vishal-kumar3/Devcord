import { getLoggedInUser } from "@/actions/user.action";
import { notFound } from "next/navigation";
import { getConversationAndUserById } from "@/actions/conversation.action";
import { ConversationWithMembers } from "@/types/conversation.type";
import { getMessageByConversationId, getNextCombinedMessage } from "@/actions/message.action";
import { MessageWithSender } from "@/types/message.types";
import Chat from "@/components/Chat/Chat";

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

  const chat_messages: MessageWithSender[] | null = await getMessageByConversationId(conversationId)

  return (
    <div className="w-full">
      <Chat chat_message={chat_messages || []} conversationId={conversationId} conversation={conversation} user={loggedUser} />
    </div>
  );
}
