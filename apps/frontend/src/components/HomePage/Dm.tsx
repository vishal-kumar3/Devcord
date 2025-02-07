import { Session } from "next-auth"
import { DevPopover } from "../DevPopover"




const DM = ({ session }: { session: Session }) => {



  return (
    <DevPopover
      title="Select Friends"
      description="Select friends to start conversation"
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
