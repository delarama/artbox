"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import { AppBackHeader } from "@/components/layout/AppBackHeader";
import { MobileFrame } from "@/components/layout/MobileFrame";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { fetchAuthConfig, registerAccount, sendOtpCode, type AuthConfig } from "@/lib/api-client";
import { getMinPasswordLength } from "@/lib/env";
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

type AuthMethod = "password" | "otp";

function safeCallbackUrl(raw: string | null) {
  if (!raw || !raw.startsWith("/app/") || raw.startsWith("/app/login")) {
    return "/app/choose";
  }
  return raw;
}

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl"));
  const { state, setAuthMode, completeAuth } = useOrder();
  const [authConfig, setAuthConfig] = useState<AuthConfig | null>(null);
  const [method, setMethod] = useState<AuthMethod>("password");
  const [email, setEmail] = useState(state.auth.email);
  const [password, setPassword] = useState("");
  const [name, setName] = useState(state.auth.name);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [devCodeHint, setDevCodeHint] = useState<string | null>(null);
  const isSignup = state.authMode === "signup";

  useEffect(() => {
    fetchAuthConfig().then(setAuthConfig).catch(() => setAuthConfig(null));
  }, []);

  const finishSignIn = async () => {
    completeAuth();
    await getSession();
    window.location.href = callbackUrl;
  };

  const proceedWithPassword = async () => {
    setError(null);
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!normalizedEmail) {
      setError("Enter your email address.");
      return;
    }
    if (isSignup && !trimmedName) {
      setError("Enter your first name.");
      return;
    }
    if (password.length < getMinPasswordLength()) {
      setError(`Password must be at least ${getMinPasswordLength()} characters.`);
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        await registerAccount(trimmedName, normalizedEmail, password);
      }
      const result = await signIn("credentials", {
        email: normalizedEmail,
        password,
        redirect: false,
      });
      if (!result || result.error || result.ok === false) {
        setError(
          isSignup
            ? "Account created, but sign-in failed. Try logging in with Email code."
            : "Invalid email or password. Try Email code or Forgot password.",
        );
        return;
      }
      await finishSignIn();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      if (isSignup && message.includes("already exists")) {
        setError("That email is already registered. Log in, or use Email code on the login page.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const sendCode = async () => {
    setError(null);
    setDevCodeHint(null);
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const result = await sendOtpCode(normalizedEmail);
      setOtpSent(true);
      if (result.devCode) setDevCodeHint(result.devCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send sign-in code");
    } finally {
      setLoading(false);
    }
  };

  const proceedWithOtp = async () => {
    setError(null);
    const normalizedEmail = email.trim().toLowerCase();
    const code = otpCode.trim();
    if (!normalizedEmail || !code) {
      setError("Enter your email and the 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("otp", {
        email: normalizedEmail,
        code,
        redirect: false,
      });
      if (!result || result.error || result.ok === false) {
        setError("Invalid or expired code. Request a new one.");
        return;
      }
      await finishSignIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const socialSignIn = (provider: "google" | "apple") => {
    setError(null);
    void signIn(provider, { callbackUrl });
  };

  const showGoogle = authConfig?.google ?? false;
  const showApple = authConfig?.apple ?? false;
  const showOtp = authConfig?.otp ?? false;
  const showSocial = showGoogle || showApple;

  return (
    <MobileFrame>
      <div className="flex min-h-screen flex-col">
        <AppBackHeader href="/" />
        <form
          className="flex flex-1 flex-col px-6 pb-6 pt-9"
          onSubmit={(e) => {
            e.preventDefault();
            if (method === "otp") {
              if (otpSent) void proceedWithOtp();
              else void sendCode();
            } else {
              void proceedWithPassword();
            }
          }}
        >
          <h1 className="mb-1.5 text-[26px] font-bold tracking-tight text-navy">
            {method === "otp" ? "Sign in with email" : isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mb-6 text-[15px] leading-relaxed text-body-alt">
            {method === "otp"
              ? "We'll email you a one-time code — no password needed."
              : isSignup
                ? "Save your gallery, track orders, and pick up right where you left off."
                : "Log in to track your order and manage your books."}
          </p>

          {showSocial ? (
            <div className="mb-5 flex flex-col gap-3">
              {showGoogle ? (
                <Button type="button" variant="outline" fullWidth onClick={() => socialSignIn("google")} className="border-[#E4D8DC] text-body hover:bg-[#FAF7F8]">
                  <GoogleIcon /> Continue with Google
                </Button>
              ) : null}
              {showApple ? (
                <Button type="button" variant="outline" fullWidth onClick={() => socialSignIn("apple")} className="border-[#E4D8DC] text-body hover:bg-[#FAF7F8]">
                  <AppleIcon /> Continue with Apple
                </Button>
              ) : null}
            </div>
          ) : null}

          {showSocial && method === "password" ? (
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-[#B0A6A9]">or</span>
              <span className="h-px flex-1 bg-border" />
            </div>
          ) : null}

          {showOtp ? (
            <div className="mb-5 flex rounded-full bg-pink-light p-1">
              <button
                type="button"
                onClick={() => {
                  setMethod("password");
                  setError(null);
                }}
                className={`flex-1 rounded-full border-0 py-2.5 text-sm font-semibold ${method === "password" ? "bg-white text-pink shadow-sm" : "bg-transparent text-muted"}`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setMethod("otp");
                  setError(null);
                  setOtpSent(false);
                  setOtpCode("");
                }}
                className={`flex-1 rounded-full border-0 py-2.5 text-sm font-semibold ${method === "otp" ? "bg-white text-pink shadow-sm" : "bg-transparent text-muted"}`}
              >
                Email code
              </button>
            </div>
          ) : null}

          {method === "password" ? (
            <>
              <div className="flex flex-col gap-3.5">
                {isSignup ? (
                  <Input
                    label="First name"
                    placeholder="First name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                ) : null}
                <Input
                  label="Email"
                  placeholder="Email"
                  inputMode="email"
                  autoComplete="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Password"
                  placeholder="Password"
                  type="password"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {!isSignup ? (
                  <Link href="/app/forgot-password" className="-mt-1 self-end text-[13px] font-medium text-muted no-underline">
                    Forgot password?
                  </Link>
                ) : null}
              </div>

              <Button type="submit" fullWidth className="mt-5" disabled={loading}>
                {loading ? "Please wait…" : isSignup ? "Create account" : "Log in"}
              </Button>

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
            </>
          ) : (
            <>
              <div className="flex flex-col gap-3.5">
                <Input
                  label="Email"
                  placeholder="Email"
                  inputMode="email"
                  autoComplete="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {otpSent ? (
                  <Input
                    label="6-digit code"
                    placeholder="123456"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    name="otp"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  />
                ) : null}
              </div>

              {devCodeHint ? (
                <p className="mt-3 rounded-xl bg-pink-light px-4 py-3 text-sm text-pink">
                  Dev mode — your code is <strong>{devCodeHint}</strong>
                </p>
              ) : null}

              {!otpSent ? (
                <Button type="submit" fullWidth className="mt-5" disabled={loading}>
                  {loading ? "Sending…" : "Send sign-in code"}
                </Button>
              ) : (
                <>
                  <Button type="submit" fullWidth className="mt-5" disabled={loading || otpCode.length < 6}>
                    {loading ? "Verifying…" : "Verify & sign in"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => void sendCode()}
                    disabled={loading}
                    className="mt-3 w-full border-0 bg-transparent text-sm font-semibold text-pink"
                  >
                    Resend code
                  </button>
                </>
              )}
            </>
          )}

          {error ? <p className="mt-3 text-center text-sm text-coral">{error}</p> : null}
        </form>
      </div>
    </MobileFrame>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <LoginForm />
    </Suspense>
  );
}
