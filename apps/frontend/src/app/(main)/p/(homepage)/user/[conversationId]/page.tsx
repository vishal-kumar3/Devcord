import Chat from "../../../../../../components/Chat/chat";

// app/projects/[id]/page.tsx
export default async function Page({
  params
}: {
  params: Promise<{ conversationId: string }>;
  }) {
  const { conversationId } = await params


  return (
    <div>
      Conversation Id:- {conversationId}
      <Chat />
    </div>
  );
}
