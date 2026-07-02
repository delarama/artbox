import { OrderProvider } from "@/lib/order-context";
import { AuthSessionProvider } from "@/components/providers/SessionProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      <OrderProvider>{children}</OrderProvider>
    </AuthSessionProvider>
  );
}
