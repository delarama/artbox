import { cn } from "@/lib/cn";

export function MobileFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-screen bg-canvas">
      <div
        className={cn(
          "mx-auto min-h-screen max-w-[440px] overflow-hidden bg-white text-body shadow-[0_0_60px_rgba(0,0,0,0.08)]",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
