"use client"
import data, { Emoji } from '@emoji-mart/data';
import { init, SearchIndex } from 'emoji-mart';
import { useEffect, useState } from 'react';
import { DevCommandPallet } from '../DevCommandPallet';
import { fetchEmojisSuggestions } from '../../utils/emoji';

interface EmojiSuggestionsProps {
  isOpen: boolean;
  query: string;
  onSelect: (emoji: string) => void;
  onClose: () => void;
  position: { top: number };
}

init({ data })

export function EmojiSuggestions({ query, onSelect, onClose, position, isOpen }: EmojiSuggestionsProps) {
  const [filteredEmojis, setFilteredEmojis] = useState<Emoji[]>([])
  const [isCommandOpen, setIsCommandOpen] = useState(isOpen)

  useEffect(() => {
    if (!query || query.length < 1) return setFilteredEmojis([])
    const fetchEmojis = async () => {
      const allEmojis = await fetchEmojisSuggestions(query)
      if (allEmojis.length > 0) setIsCommandOpen(true)
      setFilteredEmojis(allEmojis)
    }
    fetchEmojis()
  }, [query])

  return (
    <div
      className="absolute w-full bg-back-two-one shadow-lg z-50 overflow-hidden rounded-xl"
      style={{
        bottom: position.top + 5,
        left: 0,
      }}
    >
      <DevCommandPallet
        items={filteredEmojis}
        isOpen={isCommandOpen}
        onClose={() => {
          setIsCommandOpen(false)
          setFilteredEmojis([])
          onClose()
        }}
        onSelect={(item) => onSelect(item.skins[0].native)}
        onSpecialSelect={() => {
          const emoji = filteredEmojis[0]?.skins[0]?.native ?? ''
          if (emoji.length < 1) return
          onSelect(filteredEmojis[0].skins[0].native)
          setIsCommandOpen(false)
        }}
        renderItem={(item) => (
          <button
            type='button'
            className="w-full px-3 flex items-center space-x-2 text-left"
            onClick={() => {
              onSelect(item.skins[0].native)
              setIsCommandOpen(false)
            }}
          >
            <span className="text-lg">{item.skins[0].native}</span>
            <span className="text-gray-300 text-sm">:{item.id}:</span>
          </button>
        )}
      />
    </div>
  );
}
