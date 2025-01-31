import { ChatMsg } from "./chat"


const Message = ({ message }: { message: ChatMsg }) => {
  return (
    <div className="flex gap-2">
      <div className="size-[30px] bg-red-500 rounded-full"></div>
      <div>
        <div className="flex gap-1">
          <div>{message.user.username}</div>
          <div>11:45 PM</div>
        </div>
        <div>{message.msg}</div>
      </div>
    </div>
  )
}

export default Message
