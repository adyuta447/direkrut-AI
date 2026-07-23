import * as React from "react"
import { IconSparkles } from "@tabler/icons-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TypingDots } from "@/components/atoms/shared/TypingDots"
import { ChatBubble } from "@/components/molecules/dashboard/ChatBubble"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  displayContent?: string
  timestamp: Date
}

interface AIAssistantMessagesProps {
  messages: Message[]
  isTyping: boolean
  currentUserName?: string
  scrollRef: React.RefObject<HTMLDivElement | null>
}

export function AIAssistantMessages({
  messages,
  isTyping,
  currentUserName,
  scrollRef,
}: AIAssistantMessagesProps) {
  return (
    <ScrollArea className="flex-1 p-6 min-h-0">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-4">
        {messages.map((msg) => {
          const isUser = msg.role === "user"
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              <Avatar className="w-8 h-8 shrink-0 mt-auto">
                {isUser ? (
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {currentUserName?.charAt(0) || "U"}
                  </AvatarFallback>
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    <IconSparkles className="size-4" />
                  </AvatarFallback>
                )}
              </Avatar>

              <div className={`flex flex-col gap-1 min-w-0 ${isUser ? "items-end" : "items-start"}`}>
                <span className="text-[10px] text-muted-foreground px-1 shrink-0">
                  {isUser ? "Kamu" : "AI"} •{" "}
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                <ChatBubble
                  from={isUser ? "user" : "ai"}
                  className="max-w-none animate-in fade-in slide-in-from-bottom-2 break-words break-all whitespace-pre-wrap"
                >
                  {msg.displayContent ?? msg.content}
                </ChatBubble>
              </div>
            </div>
          )
        })}

        {isTyping && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <Avatar className="w-8 h-8 shrink-0 mt-auto">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                <IconSparkles className="size-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1 items-start">
              <div className="px-4 py-3 rounded-2xl bg-muted text-foreground rounded-bl-sm">
                <div className="flex items-center h-4">
                  <TypingDots />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={scrollRef} className="h-1" />
      </div>
    </ScrollArea>
  )
}
