import { cn } from "@/lib/cn";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "pink" | "purple" | "teal" | "muted";
  className?: string;
};

const variants = {
  pink: "bg-pink-light text-pink-dark",
  purple: "bg-purple text-white",
  teal: "bg-[#E2F4EC] text-teal",
  muted: "bg-pink-light text-pink-dark",
};

export function Badge({ children, variant = "pink", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em]",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
