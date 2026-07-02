import { MobileFrame } from "@/components/layout/MobileFrame";
import { BottomTabs } from "@/components/layout/BottomTabs";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileFrame className="relative flex min-h-screen flex-col">
      {children}
      <BottomTabs />
    </MobileFrame>
  );
}
