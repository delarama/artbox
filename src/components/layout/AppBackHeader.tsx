import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

export function AppBackHeader({
  href,
  onBack,
  accent = "pink",
}: {
  href?: string;
  onBack?: () => void;
  accent?: "pink" | "purple";
}) {
  const btnClass = cn(
    "ab-icon-tap rounded-full text-lg",
    accent === "purple" ? "bg-[#EFEEFB] text-purple" : "bg-pink-light text-pink",
  );

  return (
    <div className="flex items-center gap-3 border-b border-[#F3E3E8] px-[18px] py-3.5">
      {href ? (
        <Link href={href} className={btnClass} aria-label="Go back">
          ←
        </Link>
      ) : (
        <button type="button" onClick={onBack} className={btnClass} aria-label="Go back">
          ←
        </button>
      )}
      <Logo size="sm" />
    </div>
  );
}
