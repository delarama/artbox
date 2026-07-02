"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AppBackHeader } from "@/components/layout/AppBackHeader";
import { MobileFrame } from "@/components/layout/MobileFrame";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { resetPassword } from "@/lib/api-client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return <p className="text-sm text-coral">This reset link is invalid. Request a new one.</p>;
  }

  return (
    <>
      <Input
        label="New password"
        placeholder="New password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        fullWidth
        className="mt-5"
        disabled={loading || password.length < 8}
        onClick={async () => {
          setLoading(true);
          setError(null);
          try {
            await resetPassword(token, password);
            router.push("/app/login");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Reset failed");
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? "Saving…" : "Set new password"}
      </Button>
      {error ? <p className="mt-3 text-center text-sm text-coral">{error}</p> : null}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <MobileFrame>
      <div className="flex min-h-screen flex-col">
        <AppBackHeader href="/app/login" />
        <div className="flex flex-1 flex-col px-6 pb-6 pt-9">
          <h1 className="mb-1.5 text-[26px] font-bold tracking-tight text-navy">Set a new password</h1>
          <p className="mb-6 text-[15px] leading-relaxed text-body-alt">Choose a password at least 8 characters long.</p>
          <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
            <ResetPasswordForm />
          </Suspense>
          <p className="mt-6 text-center text-sm text-muted">
            <Link href="/app/forgot-password" className="font-semibold text-pink no-underline">
              Request a new link
            </Link>
          </p>
        </div>
      </div>
    </MobileFrame>
  );
}
