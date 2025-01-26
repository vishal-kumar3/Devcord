import Chat from "@/components/Chat/chat";
import { getLoggedInUser } from "../../../../../../actions/user.action";
import { notFound } from "next/navigation";

// app/projects/[id]/page.tsx
export default async function Page({
  params
}: {
  params: Promise<{ conversationId: string }>;
  }) {
  const { conversationId } = await params


  const loggedUser = await getLoggedInUser()
  if(!loggedUser) return notFound()
  return (
    <div className="w-full">
      {/* Conversation Id:- {conversationId} */}
      <Chat conversationId={conversationId} user={loggedUser} />
    </div>
  );
}
