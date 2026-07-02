import { cn } from "@/lib/cn";

export function SelectionCard({
  selected,
  accent = "pink",
  onClick,
  children,
  className,
}: {
  selected: boolean;
  accent?: "pink" | "purple";
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const accentColor = accent === "purple" ? "#7F77DD" : "#D4537E";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border-2 bg-white p-4 text-left shadow-[0_4px_14px_rgba(0,0,0,0.04)]",
        className,
      )}
      style={{ borderColor: selected ? accentColor : "#EEE6E8" }}
    >
      {children}
    </button>
  );
}

export function CheckBox({
  checked,
  accent = "pink",
}: {
  checked: boolean;
  accent?: "pink" | "purple";
}) {
  const accentColor = accent === "purple" ? "#7F77DD" : "#D4537E";
  return (
    <span
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] text-[13px] font-bold text-white"
      style={{
        background: checked ? accentColor : "transparent",
        border: `2px solid ${checked ? accentColor : "#DCCED3"}`,
      }}
    >
      {checked ? "✓" : ""}
    </span>
  );
}

export function RadioDot({
  selected,
  accent = "pink",
}: {
  selected: boolean;
  accent?: "pink" | "purple";
}) {
  const accentColor = accent === "purple" ? "#7F77DD" : "#D4537E";
  return (
    <span
      className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full"
      style={{ border: `2px solid ${selected ? accentColor : "#DCCED3"}` }}
    >
      <span
        className="h-[11px] w-[11px] rounded-full"
        style={{ background: selected ? accentColor : "transparent" }}
      />
    </span>
  );
}
