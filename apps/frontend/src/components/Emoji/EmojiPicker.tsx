"use client"
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export const RenderEmojiPicker = ({ onSelect }: EmojiPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="p-2 hover:bg-[#2e3035] rounded-full transition-colors"
        >
          <Smile className="w-5 h-5 text-gray-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent avoidCollisions side='left' align='end' alignOffset={60} sideOffset={20}>
        <EmojiPicker
          onSelect={onSelect}
        />
      </PopoverContent>
    </Popover>
  )
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  return (
    <Picker
      data={data}
      onEmojiSelect={(emoji: any) => onSelect(emoji.native)}
      theme="dark"
      skinTonePosition="none"
      previewPosition="none"
      maxFrequentRows={2}
    />
  );
}
