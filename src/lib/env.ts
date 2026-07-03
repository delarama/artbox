export function isProductionBackendEnabled() {
  return Boolean(process.env.DATABASE_URL);
}

export function getMinPasswordLength() {
  return process.env.NODE_ENV === "development" ? 4 : 8;
}

function isValidStripeSecretKey(key: string) {
  return key.startsWith("sk_test_") || key.startsWith("sk_live_");
}

export function isStripeEnabled() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  return Boolean(key && isValidStripeSecretKey(key));
}

export function getStripeConfigError(): string | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key || isValidStripeSecretKey(key)) return null;
  if (key.startsWith("pk_")) {
    return "Stripe is misconfigured: STRIPE_SECRET_KEY is a publishable key (pk_). Use the secret key (sk_test_...) from Stripe Dashboard → Developers → API keys.";
  }
  if (key.startsWith("whsec_")) {
    return "Stripe is misconfigured: STRIPE_SECRET_KEY is a webhook secret. Use sk_test_... here and put whsec_... in STRIPE_WEBHOOK_SECRET.";
  }
  return "Stripe is misconfigured: STRIPE_SECRET_KEY must be your Secret key from Stripe Dashboard → Developers → API keys (starts with sk_test_ or sk_live_).";
}

export function getAppUrl() {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function isSupabaseStorageEnabled() {
  return Boolean(
    process.env.SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.SUPABASE_STORAGE_BUCKET,
  );
}

export function getStorageMode(): "supabase" | "s3" | "local" {
  if (isSupabaseStorageEnabled()) return "supabase";
  if (process.env.S3_BUCKET) return "s3";
  return "local";
}
