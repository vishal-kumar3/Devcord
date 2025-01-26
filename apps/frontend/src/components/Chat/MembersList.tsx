
// WIP: socket for online offline, also ui

export function MembersList() {
  return (
    <div className="p-4">
      <p className="font-semibold">Members - 3</p>
      <div className="space-y-2">
        <Member />
        <Member />
        <Member />
      </div>
    </div>
  )
}


const Member = () => {
  return (
    <div className="flex gap-2 items-center">
      <div className="size-[40px] bg-black rounded-full"></div>
      <p>
        Username
      </p>
    </div>
  )
}
