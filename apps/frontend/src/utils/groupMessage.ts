import { Message } from "@prisma/client";


export type MessageGroup = {
  senderId: string | null;
  messages: Message[];
}


function groupMessages(messages: Message[], thresholdInMs: number = 300000): MessageGroup[] {
  if (messages.length === 0) return [];

  const groups: MessageGroup[] = [];
  let currentGroup: MessageGroup = {
    senderId: messages[0].senderId,
    messages: [messages[0]],
  };

  for (let i = 1; i < messages.length; i++) {
    const prevMessage = messages[i - 1];
    const currMessage = messages[i];
    const timeDiff = new Date(currMessage.createdAt).getTime() - new Date(prevMessage.createdAt).getTime();

    // If same sender and within threshold, group them
    if (currMessage.senderId === prevMessage.senderId && timeDiff <= thresholdInMs) {
      currentGroup.messages.push(currMessage);
    } else {
      groups.push(currentGroup);
      currentGroup = {
        senderId: currMessage.senderId,
        messages: [currMessage],
      };
    }
  }
  groups.push(currentGroup);
  return groups;
}
