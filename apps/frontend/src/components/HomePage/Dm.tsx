import { Session } from "next-auth"
import { DevPopover } from "../DevPopover"
import { User } from "@prisma/client"




const DM = ({ session, friends }: { session: Session, friends: User[] }) => {



  return (
    <DevPopover
      title="Select Friends"
      description="You can add 9 more friends."
      Main={<DMBody  />}
    />
  )
}

export const DMBody = (
  { update=false }
    :
    { update?: boolean }
) => {
  return (
    <div>
      <div></div>
      <div></div>
    </div>
  )
}


export default DM
