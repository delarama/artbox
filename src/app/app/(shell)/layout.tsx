import { MobileFrame } from "@/components/layout/MobileFrame";
import { BottomTabs } from "@/components/layout/BottomTabs";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileFrame className="relative flex min-h-screen flex-col pb-[calc(3.5rem+env(safe-area-inset-bottom))]">
      {children}
      <BottomTabs />
    </MobileFrame>
  );
}
