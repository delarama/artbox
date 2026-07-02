export function isProductionBackendEnabled() {
  return Boolean(process.env.DATABASE_URL);
}

export function isStripeEnabled() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLISHABLE_KEY);
}

export function getAppUrl() {
  return process.env.NEXTAUTH_URL ?? process.env.VERCEL_URL ?? "http://localhost:3000";
}
