import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "text-lg",
  md: "text-[22px]",
  lg: "text-5xl",
};

export function Logo({ className, size = "md" }: LogoProps) {
  return (
    <span
      className={cn("font-extrabold tracking-tight", sizeClasses[size], className)}
      aria-label="ArtBox"
    >
      <span className="text-coral">A</span>
      <span className="text-amber">r</span>
      <span className="text-amber">t</span>
      <span className="text-teal">B</span>
      <span className="text-blue">o</span>
      <span className="text-purple">x</span>
    </span>
  );
}
