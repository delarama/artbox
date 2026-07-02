import Link from "next/link";
import { cn } from "@/lib/cn";

export function StickyFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky bottom-0 border-t border-[#F3E3E8] bg-white/96 px-5 py-3.5 backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ProgressHeader({
  step1,
  step2,
  accent = "pink",
  backHref,
  onBack,
}: {
  step1: { label: string; done?: boolean };
  step2: { label: string; active?: boolean };
  accent?: "pink" | "purple";
  backHref?: string;
  onBack?: () => void;
}) {
  const accentColor = accent === "purple" ? "text-purple" : "text-pink";
  const accentBg = accent === "purple" ? "bg-purple" : "bg-pink";
  const softBg = accent === "purple" ? "bg-[#EFEEFB]" : "bg-pink-light";

  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-[#F3E3E8] bg-white/94 px-[18px] py-3.5 backdrop-blur-md">
      {backHref ? (
        <Link href={backHref} className={cn("flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-lg no-underline", softBg, accentColor)} aria-label="Go back">
          ←
        </Link>
      ) : (
        <button type="button" onClick={onBack} className={cn("flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border-0 text-lg", softBg, accentColor)}>
          ←
        </button>
      )}
      <div className="flex flex-1 items-center justify-center gap-2.5">
        <span className="flex items-center gap-1.5">
          <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white", step1.done ? "bg-teal" : accentBg)}>
            {step1.done ? "✓" : "1"}
          </span>
          <span className={cn("text-[13px] font-semibold", step1.done ? "text-teal" : accentColor)}>{step1.label}</span>
        </span>
        <span className={cn("h-0.5 w-5", accentBg)} />
        <span className="flex items-center gap-1.5">
          <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold", step2.active ? cn("text-white", accentBg) : "bg-[#F0E1E7] text-[#B99AA4]")}>
            2
          </span>
          <span className={cn("text-[13px] font-semibold", step2.active ? accentColor : "text-[#B99AA4]")}>{step2.label}</span>
        </span>
      </div>
    </div>
  );
}
