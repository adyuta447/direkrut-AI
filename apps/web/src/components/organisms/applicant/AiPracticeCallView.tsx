import { useAiPracticeSimulation } from "../../../lib/applicant/useAiPracticeSimulation";
import { AiPracticeTopBar } from "./AiPracticeTopBar";
import { AiPracticeVideoGrid } from "./AiPracticeVideoGrid";
import { AiPracticeChatPanel } from "./AiPracticeChatPanel";
import { AiPracticeControlBar } from "./AiPracticeControlBar";

interface AiPracticeCallViewProps {
  userName: string;
  sim: ReturnType<typeof useAiPracticeSimulation>;
}

export function AiPracticeCallView({ userName, sim }: AiPracticeCallViewProps) {
  return (
    <div className="h-full flex flex-col bg-surface-1 font-sans border border-hairline max-w-[1584px] mx-auto w-full overflow-hidden">
      <AiPracticeTopBar timer={sim.timer} currentQ={sim.currentQ} progress={sim.progress} />

      <div className="flex-1 flex overflow-hidden relative">
        <AiPracticeVideoGrid
          camOn={sim.camOn}
          micOn={sim.micOn}
          userName={userName}
          aiSpeaking={sim.aiSpeaking}
          aiTyping={sim.aiTyping}
          currentCaption={sim.currentCaption}
        />

        {sim.chatOpen && (
          <AiPracticeChatPanel
            userName={userName}
            messages={sim.messages}
            aiTyping={sim.aiTyping}
            chatEndRef={sim.chatEndRef}
            input={sim.input}
            onInputChange={sim.setInput}
            onKeyDown={sim.handleKey}
            onSend={sim.sendAnswer}
            onClose={() => sim.setChatOpen(false)}
          />
        )}
      </div>

      <AiPracticeControlBar
        micOn={sim.micOn}
        camOn={sim.camOn}
        chatOpen={sim.chatOpen}
        onToggleMic={() => sim.setMicOn((v) => !v)}
        onToggleCam={() => sim.setCamOn((v) => !v)}
        onToggleChat={() => sim.setChatOpen((v) => !v)}
        onHangUp={() => sim.setPhase("done")}
      />
    </div>
  );
}
