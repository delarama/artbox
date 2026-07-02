"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { AppBackHeader } from "@/components/layout/AppBackHeader";
import { MobileFrame } from "@/components/layout/MobileFrame";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { registerAccount } from "@/lib/api-client";
import { useOrder } from "@/lib/order-context";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2c-.3 1.4-1.1 2.6-2.3 3.4v2.8h3.7C21.8 18.7 23 15.8 23 12.3z" />
      <path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.8c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.8H1.8v2.9C3.7 21.4 7.6 24 12 24z" />
      <path fill="#FBBC05" d="M5.6 14.7c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V7.4H1.8C1 8.8.6 10.4.6 12.5s.4 3.7 1.2 5.1l3.8-2.9z" />
      <path fill="#EA4335" d="M12 5.4c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.8 15.1.8 12 .8 7.6.8 3.7 3.4 1.8 7.4l3.8 2.9C6.5 7.4 9 5.4 12 5.4z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="#1C1C2E" aria-hidden>
      <path d="M17.05 12.5c0-2 1.6-3 1.7-3.05-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7 1 1.4 2 2.4 2 1 0 1.3-.6 2.5-.6s1.5.6 2.5.6 1.7-1 2.3-1.9c.7-1.1 1-2.1 1-2.2 0-.1-2-.8-2-3zm-2-5.5c.5-.7.9-1.6.8-2.5-.8 0-1.8.5-2.4 1.2-.5.6-1 1.5-.8 2.4.9.1 1.8-.4 2.4-1.1z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/app/choose";
  const { state, setAuthMode, setAuth, completeAuth } = useOrder();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isSignup = state.authMode === "signup";

  const proceed = async () => {
    setError(null);
    setLoading(true);
    try {
      if (isSignup) {
        await registerAccount(state.auth.name, state.auth.email, state.auth.password);
      }
      const result = await signIn("credentials", {
        email: state.auth.email,
        password: state.auth.password,
        redirect: false,
      });
      if (result?.error) {
        setError(isSignup ? "Account created, but sign-in failed. Try logging in." : "Invalid email or password.");
        return;
      }
      completeAuth();
      router.push(callbackUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const socialSignIn = async (provider: "google" | "apple") => {
    setError(null);
    await signIn(provider, { callbackUrl: "/app/choose" });
  };

  return (
    <MobileFrame>
      <div className="flex min-h-screen flex-col">
        <AppBackHeader href="/" />
        <div className="flex flex-1 flex-col px-6 pb-6 pt-9">
          <h1 className="mb-1.5 text-[26px] font-bold tracking-tight text-navy">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mb-6 text-[15px] leading-relaxed text-body-alt">
            {isSignup
              ? "Save your gallery, track orders, and pick up right where you left off."
              : "Log in to track your order and manage your books."}
          </p>

          <div className="mb-5 flex flex-col gap-3">
            <Button variant="outline" fullWidth onClick={() => socialSignIn("google")} className="border-[#E4D8DC] text-body hover:bg-[#FAF7F8]">
              <GoogleIcon /> Continue with Google
            </Button>
            <Button variant="outline" fullWidth onClick={() => socialSignIn("apple")} className="border-[#E4D8DC] text-body hover:bg-[#FAF7F8]">
              <AppleIcon /> Continue with Apple
            </Button>
          </div>

          <div className="mb-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-[#B0A6A9]">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="flex flex-col gap-3.5">
            {isSignup ? (
              <Input
                label="First name"
                placeholder="First name"
                value={state.auth.name}
                onChange={(e) => setAuth({ name: e.target.value })}
              />
            ) : null}
            <Input
              label="Email"
              placeholder="Email"
              inputMode="email"
              value={state.auth.email}
              onChange={(e) => setAuth({ email: e.target.value })}
            />
            <Input
              label="Password"
              placeholder="Password"
              type="password"
              value={state.auth.password}
              onChange={(e) => setAuth({ password: e.target.value })}
            />
            {!isSignup ? (
              <Link href="/app/forgot-password" className="-mt-1 self-end text-[13px] font-medium text-muted no-underline">
                Forgot password?
              </Link>
            ) : null}
          </div>

          <Button fullWidth className="mt-5" onClick={proceed} disabled={loading}>
            {loading ? "Please wait…" : isSignup ? "Create account" : "Log in"}
          </Button>
          {error ? <p className="mt-3 text-center text-sm text-coral">{error}</p> : null}

          <p className="mt-5 text-center text-sm text-muted">
            {isSignup ? "Already have an account?" : "New to ArtBox?"}{" "}
            <button
              type="button"
              onClick={() => setAuthMode(isSignup ? "login" : "signup")}
              className="border-0 bg-transparent p-0 text-sm font-semibold text-pink"
            >
              {isSignup ? "Log in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </MobileFrame>
  );
}
