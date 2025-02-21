"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Smile } from 'lucide-react';
import { EmojiPicker } from '../Emoji/EmojiPicker';
import { EmojiSuggestions } from '../Emoji/EmojiSuggestions';

interface MessageEditProps {
  initialContent: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

export function MessageInput({ initialContent, onSave, onCancel }: MessageEditProps) {
  const [content, setContent] = useState(initialContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState('');
  const [emojiSearchPosition, setEmojiSearchPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
      adjustTextareaHeight();
    }
  }, []);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    adjustTextareaHeight();

    // Handle emoji search
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = newContent.slice(0, cursorPosition);
    const match = textBeforeCursor.match(/:(\w*)$/);

    if (match) {
      setEmojiSearch(match[1]);
      // Calculate position for emoji suggestions
      const textArea = textareaRef.current;
      if (textArea) {
        const cursorCoords = getCaretCoordinates(textArea, cursorPosition);
        setEmojiSearchPosition({
          top: cursorCoords.top + 20,
          left: cursorCoords.left
        });
      }
    } else {
      setEmojiSearch('');
    }
  };

  const getCaretCoordinates = (element: HTMLTextAreaElement, position: number) => {
    const { offsetLeft, offsetTop } = element;
    const div = document.createElement('div');
    const styles = getComputedStyle(element);
    const properties = [
      'boxSizing', 'width', 'height', 'padding', 'border', 'lineHeight',
      'fontFamily', 'fontSize', 'fontWeight', 'letterSpacing'
    ];

    properties.forEach(prop => {
      div.style[prop as any] = styles[prop];
    });

    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap';
    div.textContent = element.value.slice(0, position);

    const span = document.createElement('span');
    span.textContent = element.value[position] || '.';
    div.appendChild(span);
    document.body.appendChild(div);

    const { offsetLeft: spanX, offsetTop: spanY } = span;
    document.body.removeChild(div);

    return {
      left: offsetLeft + spanX,
      top: offsetTop + spanY
    };
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (emojiSearch) {
        setEmojiSearch('');
      } else {
        onCancel();
      }
    }

    if (e.key === 'Enter' && !e.shiftKey && !isComposing && !emojiSearch) {
      e.preventDefault();
      if (content.trim()) {
        onSave(content);
      }
    }
  };

  const insertEmoji = (emoji: string) => {
    if (!textareaRef.current) return;

    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = content.slice(0, cursorPosition);
    const textAfterCursor = content.slice(cursorPosition);

    if (emojiSearch) {
      // Replace the emoji shortcode with the actual emoji
      const newTextBeforeCursor = textBeforeCursor.replace(/:(\w*)$/, emoji);
      const newContent = newTextBeforeCursor + textAfterCursor;
      setContent(newContent);
      setEmojiSearch('');

      // Set cursor position after the inserted emoji
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = newTextBeforeCursor.length;
          textareaRef.current.selectionStart = newPosition;
          textareaRef.current.selectionEnd = newPosition;
        }
      }, 0);
    } else {
      // Insert emoji at cursor position
      const newContent = textBeforeCursor + emoji + textAfterCursor;
      setContent(newContent);

      // Set cursor position after the inserted emoji
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = cursorPosition + emoji.length;
          textareaRef.current.selectionStart = newPosition;
          textareaRef.current.selectionEnd = newPosition;
        }
      }, 0);
    }

    adjustTextareaHeight();
  };

  return (
    <div className="relative">
      <div className="relative bg-[#383a40] rounded">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          className="w-full bg-transparent text-gray-100 outline-none resize-none px-3 py-2 min-h-[40px] max-h-[50vh] overflow-y-auto"
          style={{
            lineHeight: '1.375rem',
          }}
        />
        <div className="absolute right-2 bottom-2">
          <button
            ref={emojiButtonRef}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-[#2e3035] rounded-full transition-colors"
          >
            <Smile className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {showEmojiPicker && (
        <EmojiPicker
          onSelect={(emoji) => {
            insertEmoji(emoji);
            setShowEmojiPicker(false);
          }}
          onClose={() => setShowEmojiPicker(false)}
          buttonRef={emojiButtonRef}
        />
      )}

      {emojiSearch && (
        <EmojiSuggestions
          query={emojiSearch}
          onSelect={(emoji) => insertEmoji(emoji)}
          position={emojiSearchPosition}
        />
      )}

      <div className="mt-1 text-xs text-gray-400 flex items-center gap-2">
        <span>escape to <button onClick={onCancel} className="text-[#c41e3a] hover:underline">cancel</button></span>
        <span>•</span>
        <span>enter to <button onClick={() => content.trim() && onSave(content)} className="text-[#23a559] hover:underline">save</button></span>
      </div>
    </div>
  );
}
