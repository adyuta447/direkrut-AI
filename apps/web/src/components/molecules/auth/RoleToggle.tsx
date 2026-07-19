type Role = "candidate" | "hrd";

interface RoleToggleProps {
  role: Role;
  onChange: (role: Role) => void;
}

export function RoleToggle({ role, onChange }: RoleToggleProps) {
  return (
    <div className="flex bg-surface-1 rounded-full p-1.5 mb-8">
      {(["candidate", "hrd"] as const).map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          className={`flex-1 py-3 text-[15px] font-semibold rounded-full transition-none ${
            role === r
              ? "bg-primary text-white"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          {r === "candidate" ? "Kandidat" : "HRD"}
        </button>
      ))}
    </div>
  );
}
