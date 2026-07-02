export function isProductionBackendEnabled() {
  return Boolean(process.env.DATABASE_URL);
}

export function isStripeEnabled() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLISHABLE_KEY);
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
