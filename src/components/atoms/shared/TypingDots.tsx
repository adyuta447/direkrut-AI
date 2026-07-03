export function TypingDots() {
  return (
    <div className="flex gap-1.5">
      {[0, 0.15, 0.3].map((delay, i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 bg-ink-muted animate-pulse"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}
