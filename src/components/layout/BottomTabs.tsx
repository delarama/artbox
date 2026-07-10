"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useOrder } from "@/lib/order-context";

function BookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 6c-2-1.3-4.5-1.8-7-1v12c2.5-.8 5-.3 7 1 2-1.3 4.5-1.8 7-1V5c-2.5-.8-5-.3-7 1z" />
      <path d="M12 6v12" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
    </svg>
  );
}

export function BottomTabs() {
  const pathname = usePathname();
  const { state } = useOrder();
  const isDiy = state.route === "diy";
  const proofIdx = isDiy ? 2 : 5;
  const bookReady = state.stageIndex >= proofIdx && !state.approved;

  const tabs = [
    { href: "/app/book", label: "Book", icon: BookIcon, badge: bookReady },
    { href: "/app/account", label: "Account", icon: AccountIcon, badge: false },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-[440px] -translate-x-1/2 border-t border-[#F3E3E8] bg-white/97 px-0 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md">
      {tabs.map((tab) => {
        const active = pathname === tab.href || (tab.href === "/app/account" && pathname === "/app/track");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative flex min-h-11 flex-1 flex-col items-center justify-center gap-1 py-1 text-[11px] font-semibold",
              active ? "text-pink" : "text-[#B9AEB2]",
            )}
          >
            <tab.icon />
            {tab.label}
            {tab.badge ? (
              <span className="absolute right-6 top-0 h-2 w-2 rounded-full bg-teal" aria-label="Proof ready" />
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
