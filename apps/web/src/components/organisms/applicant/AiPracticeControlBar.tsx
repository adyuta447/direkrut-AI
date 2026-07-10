import { Mic, MicOff, Video, VideoOff, MessageSquare, PhoneOff } from "lucide-react";

interface AiPracticeControlBarProps {
  micOn: boolean;
  camOn: boolean;
  chatOpen: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleChat: () => void;
  onHangUp: () => void;
}

export function AiPracticeControlBar({
  micOn, camOn, chatOpen, onToggleMic, onToggleCam, onToggleChat, onHangUp,
}: AiPracticeControlBarProps) {
  return (
    <div className="flex-shrink-0 bg-canvas border-t border-hairline px-6 py-4 flex items-center justify-center gap-4">
      <button
        onClick={onToggleMic}
        className={`w-12 h-12 flex items-center justify-center border transition-none ${
          micOn ? "border-hairline text-ink hover:bg-surface-1" : "border-[#da1e28] bg-[#fff1f1] text-[#da1e28]"
        }`}
      >
        {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </button>
      <button
        onClick={onToggleCam}
        className={`w-12 h-12 flex items-center justify-center border transition-none ${
          camOn ? "border-hairline text-ink hover:bg-surface-1" : "border-[#da1e28] bg-[#fff1f1] text-[#da1e28]"
        }`}
      >
        {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
      </button>
      <button
        onClick={onToggleChat}
        className={`w-12 h-12 flex items-center justify-center border transition-none ${
          chatOpen ? "border-primary bg-primary text-white" : "border-hairline text-ink hover:bg-surface-1"
        }`}
      >
        <MessageSquare className="w-5 h-5" />
      </button>
      <div className="w-px h-6 bg-hairline mx-2" />
      <button
        onClick={onHangUp}
        className="w-12 h-12 flex items-center justify-center border border-[#da1e28] bg-[#da1e28] text-white hover:bg-[#ba1b23] transition-none"
      >
        <PhoneOff className="w-5 h-5" />
      </button>
    </div>
  );
}
