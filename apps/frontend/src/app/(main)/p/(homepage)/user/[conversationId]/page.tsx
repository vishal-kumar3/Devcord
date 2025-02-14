import { getLoggedInUser } from "@/actions/user.action";
import { notFound } from "next/navigation";
import { getConversationAndUserById } from "@/actions/conversation.action";
import { getMessageByConversationId } from "@/actions/message.action";
import Chat from "@/components/Chat/Chat";
import { ConversationWithMembers } from "@devcord/node-prisma/dist/types/userConversation.types";
import { MessageWithSender } from "@devcord/node-prisma/dist/types/message.types";

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


  if(conversation.users.every(u => u.userId !== loggedUser.id)) return notFound()

  const chat_messages: MessageWithSender[] | null = await getMessageByConversationId(conversationId)


  return (
    <div className="w-full">
      <Chat chat_message={chat_messages || []} conversationId={conversationId} conversation={conversation} user={loggedUser} />
      {/* <DummyChat chat_message={chat_messages || []} conversationId={conversationId} conversation={conversation} user={loggedUser} /> */}
    </div>
  );
}
