const page = async({
  params
}: {
  params: Promise<{ projectId: string; channelId: string }>;
  }) => {
  const { projectId, channelId } = await params

  return (
    <div>
      channel {channelId} in project {projectId}
    </div>
  )
}

export default page
