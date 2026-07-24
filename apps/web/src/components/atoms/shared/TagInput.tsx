"use client"

import * as React from "react"
import { IconX } from "@tabler/icons-react"

interface TagInputProps {
  tags: string[]
  setTags: (tags: string[]) => void
  placeholder?: string
  className?: string
}

export function TagInput({ tags, setTags, placeholder = "Ketik skill lalu Enter...", className }: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("")

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const newTag = inputValue.trim()
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag])
        setInputValue("")
      }
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      setTags(tags.slice(0, -1))
    }
  }

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove))
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring ${className || ""}`}>
      {tags.map((tag, index) => (
        <span
          key={index}
          className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="rounded-full outline-none hover:bg-primary/20 focus:bg-primary/20"
          >
            <IconX className="size-3.5" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px]"
      />
    </div>
  )
}
