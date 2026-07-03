export function InterviewSuccessBanner() {
  return (
    <div className="bg-transparent border-b border-zinc-200/60 dark:border-zinc-800/60 px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-center gap-3">
        <img src="/success.svg" alt="Success" className="w-4 h-4" />
        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
          Simulation complete — Session Recorded
        </p>
      </div>
    </div>
  );
}
