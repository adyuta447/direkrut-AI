import { Check } from "lucide-react";

interface DecisionConfirmationScreenProps {
  candidateName: string;
}

export function DecisionConfirmationScreen({ candidateName }: DecisionConfirmationScreenProps) {
  return (
    <div className="p-8 flex items-center justify-center h-full font-sans">
      <div className="bg-canvas border border-hairline p-12 text-center max-w-md">
        <div className="w-14 h-14 bg-[#defbe6] border border-[#198038] flex items-center justify-center mx-auto mb-5">
          <Check className="w-7 h-7 text-[#198038]" />
        </div>
        <h2 className="text-[24px] font-light text-ink mb-2">Notifikasi Terkirim</h2>
        <p className="text-[14px] text-ink-muted">{candidateName} telah menerima pemberitahuan melalui email.</p>
      </div>
    </div>
  );
}
