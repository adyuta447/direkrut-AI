import { Sparkles, User } from "lucide-react";
import { ChatMessage } from "../../../lib/hrd/useHrdChatAssistant";

interface HrdChatMessageBubbleProps {
  message: ChatMessage;
  currentUserName?: string;
}

export function HrdChatMessageBubble({ message, currentUserName }: HrdChatMessageBubbleProps) {
  return (
    <div className="flex gap-6 animate-in fade-in duration-500 w-full group">
      <div className="flex-shrink-0 mt-1">
        {message.sender === "ai" ? (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-surface-1 border border-hairline flex items-center justify-center font-semibold text-ink text-[14px]">
            {currentUserName?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-ink font-semibold mb-1 text-[14px]">
          {message.sender === "ai" ? "Direkrut AI" : currentUserName || "Anda"}
        </div>

        <div className="text-ink text-[14px] leading-relaxed">{message.text}</div>

        {message.actions && (
          <div className="flex flex-wrap gap-3 mt-4">
            {message.actions.map((action, idx) => (
              <button key={idx} onClick={action.onClick} className="btn-secondary py-2 px-4 text-[13px] flex items-center gap-2">
                <User className="w-4 h-4" />
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
