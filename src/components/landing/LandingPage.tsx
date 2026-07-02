"use client";

import Link from "next/link";
import { useState } from "react";
import { MobileFrame } from "@/components/layout/MobileFrame";
import { Badge } from "@/components/ui/Badge";
import { BulletList } from "@/components/ui/CheckList";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { LANDING_FAQS } from "@/lib/constants";

const steps = [
  {
    step: "STEP 1",
    title: "Order your ArtBox",
    desc: "We ship an empty box to your door within 5–7 business days.",
    color: "text-coral",
    bg: "bg-[#FBE7E6]",
    stroke: "#E24B4A",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#E24B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 8l9-4 9 4v8l-9 4-9-4V8z" />
        <path d="M3 8l9 4 9-4" />
        <path d="M12 12v8" />
      </svg>
    ),
  },
  {
    step: "STEP 2",
    title: "Fill it and send it back",
    desc: "Pack in up to 350 pieces of artwork. We include a prepaid return label.",
    color: "text-purple",
    bg: "bg-[#EFEEFB]",
    stroke: "#7F77DD",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7F77DD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M15 4l5 5L9 20l-5 1 1-5L15 4z" />
        <path d="M13 6l5 5" />
      </svg>
    ),
  },
  {
    step: "STEP 3",
    title: "Receive your keepsake",
    desc: "We photograph every piece and craft your book or framed mosaic, then ship it back within 2–3 weeks.",
    color: "text-teal",
    bg: "bg-[#E2F4EC]",
    stroke: "#1D9E75",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 21.5 7.1 18.2l.9-5.5-4-3.9 5.5-.8z" />
      </svg>
    ),
  },
];

const galleryItems = [
  { title: "Lena's Grade 1 collection", bg: "repeating-linear-gradient(45deg,#F6D7E2 0px,#F6D7E2 12px,#fff 12px,#fff 24px)", ink: "#B76A88" },
  { title: "Noah's dinosaur phase", bg: "repeating-linear-gradient(45deg,#DBD8F5 0px,#DBD8F5 12px,#fff 12px,#fff 24px)", ink: "#7A72CE" },
  { title: "Maya's rainbow period", bg: "repeating-linear-gradient(45deg,#C7EBDD 0px,#C7EBDD 12px,#fff 12px,#fff 24px)", ink: "#1D9E75" },
  { title: "The everything-is-blue era", bg: "repeating-linear-gradient(45deg,#F6D7E2 0px,#F6D7E2 12px,#fff 12px,#fff 24px)", ink: "#B76A88" },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "$149",
    pieces: "Up to 60 pieces",
    featured: false,
    bullets: ["Hardcover keepsake book", "Digital gallery", "Prepaid return shipping", "+ Art return available ($25 add-on)"],
    mutedLast: true,
  },
  {
    name: "Family",
    price: "$249",
    pieces: "Up to 150 pieces",
    featured: true,
    bullets: ["Everything in Starter", "Lay-flat premium pages", "Priority processing", "1 free digital download set"],
    mutedLast: false,
  },
  {
    name: "Archive",
    price: "$399",
    pieces: "Up to 350 pieces",
    featured: false,
    bullets: ["Everything in Family", "XL hardcover book", "Free art return included", "Dedicated account manager"],
    mutedLast: false,
  },
];

function BookIllustration() {
  return (
    <div className="relative h-[180px] w-[180px]">
      <div className="absolute left-3.5 top-[22px] h-[150px] w-[150px] -rotate-[8deg] rounded-[4px_10px_10px_4px] bg-teal shadow-lg" />
      <div className="absolute left-2 top-3.5 h-[150px] w-[150px] -rotate-[3deg] rounded-[4px_10px_10px_4px] bg-amber shadow-lg" />
      <div className="absolute left-5 top-2 flex h-[150px] w-[150px] flex-col overflow-hidden rounded-[4px_12px_12px_4px] border-l-[6px] border-black/10 bg-white shadow-xl">
        <div className="grid flex-1 grid-cols-2 gap-1.5 p-3">
          <div className="rounded-sm bg-coral" />
          <div className="rounded-sm bg-blue" />
          <div className="rounded-sm bg-purple" />
          <div className="rounded-sm bg-amber" />
        </div>
        <div className="px-3 pb-3">
          <div className="h-3 w-[82%] rounded-sm bg-navy" />
        </div>
      </div>
    </div>
  );
}

function MosaicIllustration() {
  const colors = ["#E24B4A", "#EF9F27", "#378ADD", "#7F77DD", "#1D9E75", "#D4537E", "#EF9F27", "#378ADD", "#7F77DD", "#1D9E75", "#E24B4A", "#EF9F27", "#378ADD", "#D4537E", "#1D9E75", "#7F77DD"];
  return (
    <div className="rounded-sm border border-[#ECE3E7] bg-white p-4 shadow-xl">
      <div className="grid w-[168px] grid-cols-4 gap-1.5">
        {colors.map((color, i) => (
          <div key={i} className="aspect-square rounded-sm" style={{ backgroundColor: color }} />
        ))}
      </div>
    </div>
  );
}

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [pricingOpen, setPricingOpen] = useState(false);

  return (
    <MobileFrame>
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-navy bg-navy px-6 py-4">
        <Logo />
        <div className="flex items-center gap-4">
          <a href="#how" className="text-sm font-medium text-nav-muted no-underline">
            How it works
          </a>
          <Link href="/app/login" className="rounded-full bg-pink px-[18px] py-2 text-sm font-semibold text-white no-underline hover:bg-pink-dark">
            Log in
          </Link>
        </div>
      </nav>

      <header className="bg-white px-6 pb-10 pt-14 text-center">
        <Badge className="mb-5 normal-case">Canadian keepsake studio</Badge>
        <h1 className="mb-4 text-[34px] font-bold leading-[1.15] tracking-tight text-navy">
          Their art.
          <br />
          <span className="text-pink">Your forever.</span>
        </h1>
        <p className="mx-auto mb-7 max-w-[340px] text-base leading-relaxed text-body-alt">
          Send us your child&apos;s artwork. We photograph, curate, and turn it into a beautiful keepsake — a book or framed mosaic — delivered to your door.
        </p>
        <Link href="/app/choose" className="block">
          <Button fullWidth>
            Start your ArtBox <span className="text-[17px]">→</span>
          </Button>
        </Link>
        <p className="mt-4 text-xs font-medium text-muted">Made in Canada · Priced in CAD · Ships in 2–3 weeks</p>
        <div className="mt-9 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[20px] bg-pink-light">
          <span className="px-6 text-center font-mono text-[11px] leading-relaxed tracking-wide text-muted">
            [ LIFESTYLE PHOTO ]
            <br />
            parent holding open keepsake book
            <br />
            child&apos;s colourful art on the pages
          </span>
        </div>
      </header>

      <section id="how" className="bg-white px-6 py-16">
        <h2 className="mb-10 text-center text-[26px] font-bold leading-tight tracking-tight text-navy">
          Three steps to a
          <br />
          finished keepsake
        </h2>
        <div className="flex flex-col gap-5">
          {steps.map((step) => (
            <div key={step.step} className="flex items-start gap-[18px] rounded-2xl bg-white p-[22px] shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
              <div className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] ${step.bg}`}>{step.icon}</div>
              <div>
                <span className={`text-[13px] font-bold tracking-wide ${step.color}`}>{step.step}</span>
                <h3 className="mb-1.5 text-lg font-semibold text-navy">{step.title}</h3>
                <p className="m-0 text-sm leading-snug text-[#615f5b]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-7 text-center">
          <a href="#pricing" className="text-[15px] font-semibold text-pink no-underline hover:underline">
            See pricing ↓
          </a>
        </div>
      </section>

      <section id="products" className="bg-white px-6 py-16">
        <h2 className="mb-2 text-center text-[26px] font-bold leading-tight tracking-tight text-navy">
          One box, two
          <br />
          ways to keep it
        </h2>
        <p className="mx-auto mb-9 max-w-[320px] text-center text-[15px] leading-relaxed text-body-alt">
          Fill your ArtBox, then turn it into whichever keepsake fits your home.
        </p>
        <div className="flex flex-col gap-6">
          {[
            {
              badge: "Bestseller" as const,
              badgeVariant: "pink" as const,
              title: "Keepsake Book",
              desc: "Publish your little artist in their very own hardcover book. We photograph every piece and lay it out into a vibrant book you'll page through for years.",
              bullets: ["25–350 pieces in a single book", 'Two sizes: 8"×8" or 11"×8.5"', "Lay-flat premium pages, custom cover & captions", "Digital gallery access included"],
              cta: "Start your book",
              art: <BookIllustration />,
            },
            {
              badge: "New",
              badgeVariant: "purple" as const,
              title: "Framed Mosaic",
              desc: "Put your child's masterpieces front and centre. We arrange the artwork from your ArtBox into a gallery-worthy mosaic, framed in solid wood and ready to hang.",
              bullets: ["Showcases 9 or 25 pieces, depending on size", '14"×14" or 26"×26" solid-wood frame & pro matting', "Every piece professionally photographed & edited", "Digital gallery access included"],
              cta: "Start your mosaic",
              art: <MosaicIllustration />,
            },
          ].map((product) => (
            <div key={product.title} className="overflow-hidden rounded-[20px] border border-border bg-white shadow-card">
              <div className="flex items-center justify-center bg-pink-light px-6 pb-[34px] pt-10">{product.art}</div>
              <div className="p-[26px_22px]">
                <Badge variant={product.badgeVariant}>{product.badge}</Badge>
                <h3 className="mb-2 mt-3.5 text-[22px] font-bold tracking-tight text-navy">{product.title}</h3>
                <p className="mb-[18px] text-sm leading-relaxed text-body">{product.desc}</p>
                <BulletList items={product.bullets} className="mb-5" />
                <div className="mb-[18px] flex items-baseline gap-2">
                  <span className="text-[13px] text-muted">From</span>
                  <span className="text-[26px] font-bold text-navy">$149</span>
                  <span className="text-[13px] font-medium text-muted">CAD</span>
                </div>
                <Link href="/app/choose" className="block">
                  <Button fullWidth>
                    {product.cta} <span className="text-[17px]">→</span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="bg-pink-light px-6 py-16">
        <h2 className="mb-2.5 text-center text-[26px] font-bold leading-tight tracking-tight text-navy">Simple, honest pricing</h2>
        <p className="mx-auto mb-8 max-w-[320px] text-center text-[15px] leading-relaxed text-[#615f5b]">All prices in Canadian dollars. No surprise customs fees.</p>
        <div className="flex flex-col gap-[18px]">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl bg-white p-6 shadow-card ${tier.featured ? "border-2 border-pink shadow-elevated" : "border border-border"}`}
            >
              {tier.featured ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-purple px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-white">
                  Most popular
                </span>
              ) : null}
              <span className={`text-[13px] font-semibold uppercase tracking-[0.06em] ${tier.featured ? "text-pink" : "text-muted"}`}>{tier.name}</span>
              <div className="mb-1 mt-2 flex items-baseline gap-2">
                <span className="text-[32px] font-bold text-body">{tier.price}</span>
                <span className="text-[13px] font-medium text-muted">CAD</span>
              </div>
              <p className="mb-4 text-[13px] font-medium text-[#615f5b]">{tier.pieces}</p>
              <div className="flex flex-col gap-2">
                {tier.bullets.map((bullet, i) => (
                  <span key={bullet} className={`flex items-start gap-2 text-sm leading-snug ${tier.mutedLast && i === tier.bullets.length - 1 ? "text-muted" : "text-body"}`}>
                    <span className={`font-bold ${tier.mutedLast && i === tier.bullets.length - 1 ? "text-muted" : "text-teal"}`}>
                      {tier.mutedLast && i === tier.bullets.length - 1 ? "+" : "✓"}
                    </span>
                    {bullet}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Link href="/app/choose" className="mt-6 block">
          <Button fullWidth>
            Start your ArtBox <span className="text-[17px]">→</span>
          </Button>
        </Link>
        <div className="mt-5 border-t border-[#F0E4E8] pt-4">
          <button
            type="button"
            onClick={() => setPricingOpen((v) => !v)}
            className="flex w-full items-center justify-between border-0 bg-transparent py-1.5 text-left text-sm font-semibold text-body"
          >
            What counts as a piece?
            <span className="ml-3 shrink-0 text-lg font-bold text-teal">{pricingOpen ? "−" : "+"}</span>
          </button>
          {pricingOpen ? (
            <p className="mt-2 text-sm leading-relaxed text-[#615f5b]">
              Each side of a piece of artwork counts separately. So a drawing on both sides of a page counts as 2 pieces. Booklets and folded cards each count as 2.
            </p>
          ) : null}
        </div>
      </section>

      <section className="bg-pink-light py-16">
        <div className="px-6 text-center">
          <h2 className="mb-2 text-[26px] font-bold leading-tight tracking-tight text-body">
            Books parents
            <br />
            actually cry over
          </h2>
          <p className="mb-7 text-[15px] text-muted">(No pressure.)</p>
        </div>
        <div className="ab-gallery flex gap-4 overflow-x-auto px-6 pb-5 [scroll-snap-type:x_mandatory]">
          {galleryItems.map((item) => (
            <div key={item.title} className="w-[220px] shrink-0 [scroll-snap-align:start]">
              <div className="flex aspect-[5/6] items-center justify-center overflow-hidden rounded-2xl shadow-card" style={{ background: item.bg }}>
                <span className="px-4 text-center font-mono text-[10px] leading-snug" style={{ color: item.ink }}>
                  [ OPEN BOOK ]
                  <br />
                  child&apos;s artwork
                </span>
              </div>
              <p className="mx-1 mt-3 text-[13px] font-medium text-body">{item.title}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 px-6">
          <div className="rounded-2xl bg-white p-7 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
            <span className="block h-5 text-[40px] font-bold leading-[0.5] text-[#F0C2D2]">“</span>
            <p className="mb-3.5 text-base leading-relaxed text-body">
              I didn&apos;t expect to tear up opening it. Every single painting was there, from the chaotic scribbles to the ones I actually framed. It&apos;s the best thing I&apos;ve ever spent money on.
            </p>
            <span className="text-[13px] font-semibold text-pink">— Sarah M., Toronto</span>
          </div>
          <Link href="/app/choose" className="mt-6 block">
            <Button fullWidth>
              Start your ArtBox <span className="text-[17px]">→</span>
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <h2 className="mb-8 text-center text-[26px] font-bold leading-tight tracking-tight text-navy">Questions, answered</h2>
        <div className="flex flex-col gap-3">
          {LANDING_FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={faq.q} className="overflow-hidden rounded-2xl border border-border bg-white">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-3.5 border-0 bg-transparent px-5 py-[18px] text-left text-[15px] font-semibold leading-snug text-body"
                >
                  {faq.q}
                  <span className="w-5 shrink-0 text-center text-xl font-bold text-teal">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen ? <p className="m-0 px-5 pb-5 text-sm leading-relaxed text-[#615f5b]">{faq.a}</p> : null}
              </div>
            );
          })}
        </div>
      </section>

      <section id="order" className="bg-navy px-6 pb-10 pt-16 text-center">
        <h2 className="mb-3.5 text-[28px] font-bold leading-tight tracking-tight text-white">Ready to turn that pile into a book?</h2>
        <p className="mx-auto mb-7 max-w-[320px] text-base leading-relaxed text-nav-muted">Start your ArtBox today. We&apos;ll take it from here.</p>
        <Link href="/app/choose" className="block">
          <Button variant="inverted" fullWidth>
            Start your ArtBox <span className="text-[17px]">→</span>
          </Button>
        </Link>
        <footer className="mt-12 flex flex-col items-center gap-3.5 border-t border-white/30 pt-7">
          <Logo />
          <div className="flex flex-wrap items-center justify-center gap-x-[18px] gap-y-2">
            <a href="mailto:hello@artbox.ca" className="text-[13px] font-medium text-nav-muted no-underline">
              hello@artbox.ca
            </a>
            <span className="text-white/40">·</span>
            <a href="#" className="text-[13px] font-medium text-nav-muted no-underline">
              Français
            </a>
          </div>
          <span className="text-xs text-white/70">© 2026 ArtBox Canada Inc.</span>
        </footer>
      </section>
    </MobileFrame>
  );
}
