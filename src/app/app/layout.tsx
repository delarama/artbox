import type { Metadata } from "next";
import { OrderProvider } from "@/lib/order-context";
import { siteConfig } from "@/lib/site";
import { AuthSessionProvider } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "Order your keepsake",
  description: siteConfig.appDescription,
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      <OrderProvider>{children}</OrderProvider>
    </AuthSessionProvider>
  );
}
