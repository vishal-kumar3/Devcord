import data from '@emoji-mart/data'
import { Picker } from 'emoji-mart'

const EmojiPicker = () => {
  return (
    <div>
      <Picker data={data} onEmojiSelect={console.log} />
    </div>
  )
}

export default EmojiPicker
