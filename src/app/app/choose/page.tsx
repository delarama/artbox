"use client";

import { useRouter } from "next/navigation";
import { AppBackHeader } from "@/components/layout/AppBackHeader";
import { MobileFrame } from "@/components/layout/MobileFrame";
import { useOrder } from "@/lib/order-context";

export default function ChoosePage() {
  const router = useRouter();
  const { setRoute } = useOrder();

  return (
    <MobileFrame>
      <div className="flex min-h-screen flex-col">
        <AppBackHeader href="/" />
        <div className="flex-1 px-[22px] pb-6 pt-9">
          <h1 className="mb-2 text-[27px] font-bold leading-[1.15] tracking-tight">
            How do you want to
            <br />
            make your book?
          </h1>
          <p className="mb-[30px] text-[15px] leading-relaxed text-[#615f5b]">
            Two ways to get the same beautiful keepsake — pick whichever fits your pile.
          </p>

          <button
            type="button"
            onClick={() => {
              setRoute("mail");
              router.push("/app/order/mail");
            }}
            className="mb-4 block w-full rounded-[18px] border-2 border-border bg-white p-[22px] text-left shadow-card hover:border-pink"
          >
            <div className="mb-3.5 flex items-center gap-3.5">
              <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] bg-pink-light">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D4537E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M3 8l9-4 9 4v8l-9 4-9-4V8z" />
                  <path d="M3 8l9 4 9-4" />
                  <path d="M12 12v8" />
                </svg>
              </span>
              <div>
                <div className="text-[17px] font-bold">Send us the originals</div>
                <span className="mt-1 inline-block rounded-full bg-[#E2F4EC] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal">
                  Most hands-off
                </span>
              </div>
            </div>
            <p className="m-0 text-[13px] leading-relaxed text-[#615f5b]">
              We mail you a box. Fill it with artwork, send it back, and we photograph every piece and design the book for you.
            </p>
            <span className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-pink">
              Order a box · from $29 →
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRoute("diy");
              router.push("/app/order/diy");
            }}
            className="block w-full rounded-[18px] border-2 border-border bg-white p-[22px] text-left shadow-card hover:border-purple"
          >
            <div className="mb-3.5 flex items-center gap-3.5">
              <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] bg-[#EFEEFB]">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7F77DD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 15V3" />
                  <path d="M8 7l4-4 4 4" />
                  <path d="M4 15v4a2 2 0 002 2h12a2 2 0 002-2v-4" />
                </svg>
              </span>
              <div>
                <div className="text-[17px] font-bold">Upload your own photos</div>
                <span className="mt-1 inline-block rounded-full bg-[#EFEEFB] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-purple">
                  Fastest
                </span>
              </div>
            </div>
            <p className="m-0 text-[13px] leading-relaxed text-[#615f5b]">
              Already snapped the art on your phone? Upload your photos, we lay them out into a book, and it ships to your door.
            </p>
            <span className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-purple">
              Start uploading →
            </span>
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}
