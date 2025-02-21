import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { cn } from "@/lib/cn"
import { useEffect, useState } from "react"


interface DevCommandPalletProps<T> {
  isOpen?: boolean
  onClose: () => void
  items: T[]
  onSelect: (item: T) => void
  renderItem: (item: T) => React.ReactNode
  onSpecialSelect?: () => void
}


export const DevCommandPallet = <T,>({ items, onSelect, renderItem, isOpen, onClose, onSpecialSelect }: DevCommandPalletProps<T>) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    setSelectedIndex(0)
  }, [items])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(event.key)
      if (event.key === "ArrowDown") {
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1))
      } else if (event.key === "ArrowUp") {
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (event.key === "Enter") {
        event.preventDefault()
        onSelect(items[selectedIndex])
        onClose()
      } else if (event.key === "Escape") {
        onClose()
      } else if (onSpecialSelect && event.key === ":") {
        onSpecialSelect()
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, selectedIndex, items, onSelect, onClose, onSpecialSelect])

  if (!isOpen || items.length === 0) {
    return null
  }

  return (
    <Command>
      <CommandList>
        {
          items.map((item, index) => (
            <CommandItem
              key={index}
              onClick={() => {
                onSelect(item)
                onClose()
              }}
              className={cn(
                "flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm",
                index === selectedIndex && "bg-accent text-accent-foreground"
              )}
            >
              {renderItem(item)}
            </CommandItem>
          ))
        }
      </CommandList>
    </Command>
  )
}
