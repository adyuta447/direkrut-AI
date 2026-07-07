type Role = "applicant" | "hrd";

interface RoleToggleProps {
  role: Role;
  onChange: (role: Role) => void;
}

export function RoleToggle({ role, onChange }: RoleToggleProps) {
  return (
    <div className="flex bg-surface-1 rounded-full p-1 mb-8">
      {(["applicant", "hrd"] as const).map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          className={`flex-1 py-2.5 text-[14px] font-medium rounded-full transition-none ${
            role === r
              ? "bg-primary text-white"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          {r === "applicant" ? "Kandidat" : "HRD"}
        </button>
      ))}
    </div>
  );
}
