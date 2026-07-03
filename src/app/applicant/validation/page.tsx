"use client";

import { useRouter } from "next/navigation";
import { useValidationChat } from "../../../lib/applicant/useValidationChat";
import { ValidationProgressHeader } from "../../../components/organisms/applicant/ValidationProgressHeader";
import { ValidationMessageList } from "../../../components/molecules/applicant/ValidationMessageList";
import { ValidationComposer } from "../../../components/molecules/applicant/ValidationComposer";

export default function ValidationPage() {
  const router = useRouter();
  const chat = useValidationChat(() => router.push("/applicant/scheduling"));

  return (
    <div className="h-full flex flex-col bg-canvas font-sans border border-hairline max-w-[1584px] mx-auto w-full">
      <ValidationProgressHeader
        current={chat.currentQuestion + 1}
        total={chat.totalQuestions}
        progress={chat.progress}
      />
      <ValidationMessageList
        messages={chat.messages}
        isTyping={chat.isTyping}
        messagesEndRef={chat.messagesEndRef}
      />
      <ValidationComposer
        currentInput={chat.currentInput}
        onChange={(value) => { chat.setCurrentInput(value); chat.autoResize(); }}
        onKeyDown={chat.handleKeyPress}
        onSend={chat.handleSend}
        isTyping={chat.isTyping}
        hasMoreQuestions={chat.hasMoreQuestions}
        textareaRef={chat.textareaRef}
      />
    </div>
  );
}
