import { Reaction } from "@prisma/client";

const reactionList = ["👍", "❤️", "🔥", "😂", "😢", "😡", "😱"];

export const MessageReactions = ({ reactions }: { reactions: Reaction[] }) => {
  return (
    <div className="flex gap-2">
      {reactions.map((reaction, index) => (
        <div key={index} className="text-xl">
          {reaction.emojiNative} {reaction.count}
        </div>
      ))}
    </div>
  );
};

const ReactionTab = ({
  onReactionClick,
}: {
  onReactionClick: (emoji) => void;
}) => {
  return (
    <div className="absolute -top-3 right-4 bg-back-one w-[200px] h-[20px] group-hover:opacity-100 opacity-0 transition-opacity duration-150 rounded-md flex justify-evenly items-center">
      {reactionList.map((emoji, index) => (
        <ReactionButton
          key={index}
          emoji={emoji}
          onClick={() => onReactionClick(emoji)}
        />
      ))}
    </div>
  );
};

export const ReactionButton = ({
  emoji,
  onClick,
}: {
  emoji: string;
  onClick: () => void;
}) => {
  return <button onClick={onClick}>{emoji}</button>;
};

export default ReactionTab;
