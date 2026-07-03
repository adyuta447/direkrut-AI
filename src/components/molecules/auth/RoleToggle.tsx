type Role = "applicant" | "hrd";

interface RoleToggleProps {
  role: Role;
  onChange: (role: Role) => void;
}

export function RoleToggle({ role, onChange }: RoleToggleProps) {
  return (
    <div className="flex border border-hairline mb-8 bg-surface-1">
      {(["applicant", "hrd"] as const).map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          className={`flex-1 py-3 text-[14px] font-semibold transition-none ${
            role === r
              ? "bg-canvas text-primary border-b-2 border-primary"
              : "text-ink-muted hover:text-ink hover:bg-canvas border-b-2 border-transparent"
          }`}
        >
          {r === "applicant" ? "Kandidat" : "HRD"}
        </button>
      ))}
    </div>
  );
}
