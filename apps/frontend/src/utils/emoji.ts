"use client"
import { NativeEmoji } from '@devcord/node-prisma/dist/types/message.types';
import data, { Emoji } from '@emoji-mart/data';
import { init, SearchIndex, getEmojiDataFromNative } from 'emoji-mart';

init({ data })


export const fetchEmojisSuggestions = async (query: string) =>  (await SearchIndex.search(query, {
  maxResults: 10,
  caller: 'EmojiSuggestions'
})) as Emoji[]

export const getEmojiFromNative = async (emoji: string) => {
  const emojiData = await getEmojiDataFromNative(emoji)
  return emojiData as NativeEmoji
}
