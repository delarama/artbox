import type { DiyFormat, Speed } from "./types";

export const PROMO_CODE = "ARTKIVE";
export const PROMO_AMOUNT = 10;
export const HST_RATE = 0.13;
export const STORAGE_KEY = "artbox-proto";

export const UPGRADES = [
  {
    key: "digitalPhotos" as const,
    name: "Add 25 of your own digital photos",
    desc: "Mix in your phone snaps alongside the scanned art.",
    price: 9.99,
  },
  {
    key: "cloudStorage" as const,
    name: "Cloud storage + book warranty",
    desc: "Unlimited storage & downloads · free replacement of lost or damaged books.",
    price: 18.99,
  },
  {
    key: "oneTimeDownload" as const,
    name: "One-time download",
    desc: "A single high-res download of your whole gallery.",
    price: 19.99,
  },
  {
    key: "usbDrive" as const,
    name: "USB drive",
    desc: "Your full gallery shipped on a keepsake USB.",
    price: 24.99,
  },
];

export const SPEEDS: { id: Speed; name: string; desc: string; price: number }[] = [
  { id: "standard", name: "Standard", desc: "Completed in 6–8 weeks.", price: 0 },
  { id: "rush", name: "Rush", desc: "Completed in 4–5 weeks.", price: 19 },
  { id: "superRush", name: "Super Rush", desc: "Completed in 3 weeks.", price: 29 },
];

export const FORMATS: { id: DiyFormat; name: string; desc: string; price: number }[] = [
  { id: "soft", name: "Softcover book", desc: "Up to 40 pieces · 20 pages", price: 65 },
  { id: "hard", name: "Hardcover book", desc: "Up to 80 pieces · lay-flat pages", price: 99 },
  { id: "xl", name: "XL Hardcover book", desc: "Up to 150 pieces · premium", price: 159 },
];

export const PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
];

export const LANDING_FAQS = [
  {
    q: "Do you ship across Canada?",
    a: "Yes — we ship the ArtBox to all Canadian provinces and territories, and return your finished book the same way. No cross-border surprises.",
  },
  {
    q: "What if my child's artwork is very large or oddly shaped?",
    a: "We handle it. Artwork up to 18\" × 24\" fits in the box. For anything bigger, email us at hello@artbox.ca and we'll sort it out.",
  },
  {
    q: "Can I get my original artwork back?",
    a: "Yes. Add Art Return to your order for $25 CAD and we'll carefully pack and return every original piece along with your book.",
  },
  {
    q: "How long does the whole process take?",
    a: "From the day you mail your box back to us, expect your finished book in 2–3 weeks. Total from order to book: about 4–5 weeks.",
  },
  {
    q: "Is ArtBox available in French?",
    a: "Oui! Our full website, customer service, and book design options are available in French. Just switch to Français in the top menu.",
  },
];
