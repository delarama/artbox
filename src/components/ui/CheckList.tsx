import { cn } from "@/lib/cn";

export function CheckIcon({ className }: { className?: string }) {
  return (
    <span className={cn("font-bold text-teal", className)} aria-hidden>
      ✓
    </span>
  );
}

export function BulletList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {items.map((item) => (
        <span key={item} className="flex items-start gap-2.5 text-sm leading-snug text-body">
          <CheckIcon className="shrink-0" />
          {item}
        </span>
      ))}
    </div>
  );
}
