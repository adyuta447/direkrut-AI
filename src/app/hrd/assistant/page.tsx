"use client";

import { useHrdChatAssistant } from "../../../lib/hrd/useHrdChatAssistant";
import { HrdChatHeader } from "../../../components/organisms/hrd/HrdChatHeader";
import { HrdChatMessageList } from "../../../components/organisms/hrd/HrdChatMessageList";
import { HrdChatInputArea } from "../../../components/organisms/hrd/HrdChatInputArea";

export default function HrdAssistantPage() {
  const c = useHrdChatAssistant();

  return (
    <div className="h-full flex flex-col bg-canvas font-sans w-full relative">
      <HrdChatHeader jobs={c.jobs} selectedJobId={c.selectedJobId} onSelectJob={c.setSelectedJobId} />

      <HrdChatMessageList
        messages={c.messages}
        isTyping={c.isTyping}
        currentUserName={c.currentUser?.name}
        messagesEndRef={c.messagesEndRef}
      />

      <HrdChatInputArea
        jobTitle={c.selectedJob?.title}
        input={c.input}
        onInputChange={c.setInput}
        onSend={c.handleSend}
        isTyping={c.isTyping}
        suggestions={c.availableSuggestions}
        showSuggestions={c.showSuggestionsPanel}
        onToggleSuggestions={() => c.setShowSuggestionsPanel(!c.showSuggestionsPanel)}
      />
    </div>
  );
}
