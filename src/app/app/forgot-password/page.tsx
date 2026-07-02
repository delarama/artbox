"use client";

import Link from "next/link";
import { useState } from "react";
import { AppBackHeader } from "@/components/layout/AppBackHeader";
import { MobileFrame } from "@/components/layout/MobileFrame";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { requestPasswordReset } from "@/lib/api-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <MobileFrame>
      <div className="flex min-h-screen flex-col">
        <AppBackHeader href="/app/login" />
        <div className="flex flex-1 flex-col px-6 pb-6 pt-9">
          <h1 className="mb-1.5 text-[26px] font-bold tracking-tight text-navy">Forgot password?</h1>
          <p className="mb-6 text-[15px] leading-relaxed text-body-alt">
            Enter your email and we&apos;ll send a reset link if an account exists.
          </p>
          {sent ? (
            <p className="rounded-xl bg-pink-light p-4 text-sm leading-relaxed text-pink-dark">
              If an account exists for that email, a reset link is on its way.
            </p>
          ) : (
            <>
              <Input
                label="Email"
                placeholder="Email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                fullWidth
                className="mt-5"
                disabled={loading || !email}
                onClick={async () => {
                  setLoading(true);
                  setError(null);
                  try {
                    await requestPasswordReset(email);
                    setSent(true);
                  } catch {
                    setError("Could not send reset email. Try again.");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {loading ? "Sending…" : "Send reset link"}
              </Button>
              {error ? <p className="mt-3 text-center text-sm text-coral">{error}</p> : null}
            </>
          )}
          <p className="mt-6 text-center text-sm text-muted">
            <Link href="/app/login" className="font-semibold text-pink no-underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </MobileFrame>
  );
}
