
// app/projects/[id]/page.tsx
export default async function Page({
  params
}: {
  params: Promise<{ userId: string }>;
  }) {
  const { userId } = await params
  return (
    <div>
      user number {userId}
    </div>
  );
}
