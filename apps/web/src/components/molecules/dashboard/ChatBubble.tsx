import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ChatBubble({
  from,
  children,
  className,
}: {
  from: "ai" | "user";
  children: ReactNode;
  className?: string;
}) {
  const isUser = from === "user";
  return (
    <div
      className={cn(
        "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
        isUser
          ? "ml-auto rounded-br-sm bg-primary text-primary-foreground"
          : "rounded-bl-sm bg-muted text-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}
