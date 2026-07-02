# Handoff: ArtBox — Marketing Site + Ordering App

## Overview
ArtBox is a Canadian children's-artwork preservation service. Parents either **mail in** their child's physical artwork (we photograph and curate it) **or upload their own photos**, and we turn it into a keepsake **Book** or a **Framed Mosaic**, shipped back to them.

This bundle contains two designs:
1. **Landing / marketing site** — a mobile-first long-scroll page whose single job is to convert a visitor into someone who taps **"Start your ArtBox."**
2. **Ordering app** — the full post-CTA experience: sign in, choose a route, checkout, order tracking, book-proof approval, and an account area.

## About the Design Files
The files in `designs/` are **design references authored in HTML** — high-fidelity prototypes that show the intended look, copy, and behavior. They are **not** production code to copy verbatim.

Your task is to **recreate these designs in the target codebase's environment** (React, Vue, SwiftUI, native, etc.) using its established components, patterns, and conventions. If no environment exists yet, pick the most appropriate framework for the project and build the designs there. Treat the HTML as the source of truth for **visual detail and interaction**, not for file structure.

> Note on format: the `.dc.html` source files use a lightweight component runtime (`support.js`) with `{{ }}` template holes and a `class Component` logic block. Read them for structure, inline styles (= exact design tokens), and copy. To **see them running**, open the self-contained files in `preview/` in any browser (no server, no network needed).

## Fidelity
**High-fidelity.** Final colors, typography, spacing, radii, and interactions are all specified. Recreate the UI faithfully using the codebase's existing UI library, mapping the tokens below onto its equivalents.

---

## Design Tokens

### Color
| Token | Hex | Use |
|---|---|---|
| Dark navy | `#1C1C2E` | Nav bar bg, all H1/H2/H3 heading text, final-CTA section bg |
| Pink (primary) | `#D4537E` | Primary CTA buttons, active states, "Your forever." accent, links |
| Pink dark | `#993556` | Primary button hover, badge text on pink fills |
| Pink light | `#FBEAF0` | Accent section backgrounds (Pricing + Gallery only), badge/illustration fills |
| Purple | `#7F77DD` | "Most popular" / "New" badges, step-2 accent, focus rings, DIY accent, logo `x` |
| Teal | `#1D9E75` | Success states, checkmarks, "Made in Canada", step-3 accent, logo `B` |
| Blue | `#378ADD` | Info accents, logo `o` |
| Coral | `#E24B4A` | Step-1 accent, logo `A` |
| Amber | `#EF9F27` | Star/rating accents, logo `r` and `t` |
| Body text | `#2C2C2A` | Default body copy |
| Body text (alt) | `#5F5E5A` | Hero/large intro paragraphs |
| Muted text | `#888780` | Captions, helper text, trust lines |
| White | `#FFFFFF` | Hero / How-it-works / FAQ section bg, cards |
| Canvas grey | `#E8E8EA` | Page canvas behind the 440px mobile column |

There are **no other colors**. Any lavender/mauve/dusty-pink tones from earlier drafts have been removed.

### Typography
- **Family:** Poppins (Google Fonts), weights **400 / 500 / 600 / 700 / 800**.
- H1: 700, 34px, line-height 1.15, letter-spacing −0.02em
- H2 (section): 700, 26px, line-height 1.2, letter-spacing −0.02em
- H3 (card/step title): 600, 18–22px
- Body: 400, 14–16px, line-height 1.55–1.6
- Button label: 600, 15px
- Caption / eyebrow: 500–600, 11–12px, UPPERCASE, letter-spacing 0.06em

### Logo
Wordmark "ArtBox" in **Poppins 800**, one color per letter: **A** `#E24B4A`, **r** `#EF9F27`, **t** `#EF9F27`, **B** `#1D9E75`, **o** `#378ADD`, **x** `#7F77DD`. No other styling — the color variation *is* the logo.

### Radius / Shadow / Spacing
- Radius: cards 16–20px · inputs & inner tiles 12px · buttons & badges **50px (pill)**
- Card shadow: `0 4px 16px rgba(0,0,0,0.05)` (subtle); elevated `0 8px 24px rgba(212,83,126,0.14)`
- Base spacing unit 24px; section padding 64px top/bottom on mobile
- Primary button min-height **52px**, full-width on mobile, 16px horizontal padding

### Buttons
- **Primary:** bg `#D4537E`, white text, pill, min-height 52px; hover bg `#993556`.
- **Secondary/inverted (on navy):** white bg, `#D4537E` text.
- **Outline:** white bg, 1px `#E9C6D3` border, `#D4537E` text.
- **Focus (all interactive):** `outline: 3px solid #7F77DD; outline-offset: 2px`.

Accessibility: text meets ≥4.5:1 contrast; hit targets ≥44px; every interactive element has a visible focus ring.

---

## Layout Frame
Everything is designed **mobile-first at 375px**. Screens render inside a centered **max-width 440px** white column on a `#E8E8EA` canvas so it reads on desktop too. A true wide desktop breakpoint is **not** part of this spec — if the target app needs one, adapt from the mobile layout.

---

## Design 1 — Landing (`designs/ArtBox-landing.dc.html`, preview `preview/ArtBox-landing.html`)

Single long-scroll page, sections top to bottom:

1. **Nav** (sticky, bg `#1C1C2E`) — rainbow logo (left); right group: "How it works" link (`#C8C8D8`) + **"Log in"** pill (pink bg, white text) linking to the app's auth screen.
2. **Hero** (bg white, centered) — eyebrow badge "CANADIAN KEEPSAKE STUDIO" (`#FBEAF0` fill, `#993556` text); H1 "Their art." (navy) / "Your forever." (pink); subheading (`#5F5E5A`); full-width primary CTA "Start your ArtBox →"; trust line "Made in Canada · Priced in CAD · Ships in 2–3 weeks" (`#888780`); then a solid `#FBEAF0` rounded image placeholder (lifestyle photo goes here).
3. **How it works** (bg white) — H2 "Three steps to a finished keepsake"; 3 stacked step cards. Each: 52px rounded-square icon tile + "STEP N" eyebrow + H3 + one-line description. Step accents are **coral / purple / teal** (1/2/3). Copy: (1) Order your ArtBox, (2) Fill it and send it back, (3) Receive your keepsake — "…craft your book or framed mosaic, then ship it back within 2–3 weeks." Ends with a "See pricing ↓" text link.
4. **Our Products** (bg white) — H2 "One box, two ways to keep it". Two product cards, each = a `#FBEAF0` illustration panel (CSS-drawn — a stacked book with an art-grid cover; a white gallery frame around a 4×4 grid of brand-colored tiles) + a body with eyebrow badge, H3, reworded description, 4 teal-check bullets, "From $149 CAD", and a pink CTA. Products: **Keepsake Book** (badge "Bestseller") and **Framed Mosaic** (badge "New", purple). *(Illustrations are placeholders for real product photography.)*
5. **Pricing** (bg `#FBEAF0`) — H2 "Simple, honest pricing"; 3 white book-tier cards: Starter $149 / **Family $249 (2px pink border + purple "Most popular" badge)** / Archive $399, each with 3–4 bullets. Full-width pink CTA. Collapsible "What counts as a piece?" FAQ row (teal +/− chevron).
6. **Gallery** (bg `#FBEAF0`) — H2 "Books parents actually cry over"; horizontal snap-scroll row of 4 book-preview cards (peek to hint scroll); a white review pull-quote card (— Sarah M., Toronto); pink CTA.
7. **FAQ** (bg white) — H2 "Questions, answered"; 5 accordion items, tap to expand, teal +/− chevron; only the tapped item's answer shows.
8. **Final CTA + Footer** (bg `#1C1C2E`, white text) — H2 "Ready to turn that pile into a book?"; **inverted** CTA (white bg, pink text); footer = rainbow logo, `hello@artbox.ca`, "Français", "© 2026 ArtBox Canada Inc." (links `#C8C8D8`).

Every CTA on the page routes to the app ("Start your ArtBox"). No secondary goal.

---

## Design 2 — Ordering App (`designs/ArtBox-app.dc.html`, preview `preview/ArtBox-app.html`)

A single-column mobile app driven by a `screen` value plus, once inside, a bottom-tab `tab` value. Two order **routes** branch the flow: **`mail`** (send us originals) and **`diy`** (upload your own photos).

### Screens (pre-app)
- **`auth`** — reached from the landing "Log in" (or `#login` hash). Rainbow logo; H1 toggles "Welcome back" ↔ "Create your account"; "Continue with Google" / "Continue with Apple" outline buttons (brand SVG marks); "or" divider; **First name** (signup only) + Email + Password; "Forgot password?" (login only); primary submit; a toggle link at the bottom flips login/signup. Any submit or social tap proceeds (mock auth) into `choose`, carrying name/email into the order.
- **`choose`** — H1 "How do you want to make your book?" Two large tappable cards: **"Send us the originals"** (box icon, badge "Most hands-off", → `mail`/`details`) and **"Upload your own photos"** (upload icon, badge "Fastest", → `diy`/`gallery`).

### Route A — Mail-in (`details` → `billing` → `confirmation` → `app`)
- **`details`** — 2-step progress header (Order details / Shipping). Product card for **The ArtBox** ($29 from $39 with $10 promo, kraft-box photo placeholder, feature bullets, quantity stepper, "digitization & book billed later, priced by pieces" note). Then: **Return my artwork?** toggle (+$19.99); **Recommended upgrades** (multi-select cards: digital photos +$9.99, cloud storage + warranty +$18.99, one-time download +$19.99, USB +$24.99); **Processing time** radios (Standard FREE / Rush +$19 / Super Rush +$29). Sticky footer shows live "Due today" + Continue.

### Route B — DIY upload (`gallery` → `billing` → `confirmation` → `app`)
- **`gallery`** — 2-step header (Photos / Book & checkout). **Functional upload**: a dashed dropzone supporting drag-and-drop *and* click-to-browse (`<input type=file accept=image/png,image/jpeg multiple>`), reading files via `FileReader` into data-URL thumbnails. Thumbnails render in a 3-col grid, each with a remove (×) button; live image count. Sticky footer: uploaded count + "Create book" (disabled until ≥1 photo). *(Uploaded photos live in session memory only — intentionally not persisted, to avoid storage bloat.)*

### Shared checkout
- **`billing`** — route-aware. **DIY only:** a "Choose your book" format radio (Softcover $65 / Hardcover $99 / XL $159) priced against the uploaded photo count. Then an **Order summary** (line items + HST 13% + free shipping, computed live), **Contact** (first/last/email/phone), **Shipping address** (Canada-locked, province select), **Promo** (code `ARTKIVE` = −$10, pre-applied), **Payment** (card number / expiry / CVC — mock). Accent color follows the route (pink for mail, purple for DIY). Place-order button shows the total.
- **`confirmation`** — success check animation; route-aware headline ("Your box is on the way!" vs "Your book is in the works!"); order number chip; a 3-step "What happens next" list. CTA "Track your order →" enters the app shell.

### App shell (`app`) — bottom tabs: **Book**, **Account** (+ **Track**, reached from Account)
- **Track** (opened from Account's "View tracker") — back-to-Account link; vertical timeline of stages with done (teal ✓) / current (pink pulsing ●) / upcoming markers. **Route-aware stages:** mail = Order placed → ArtBox on its way → Fill & mail back → Art photographed → **Book invoice ready** (inline "priced by pieces" invoice + pay button) → **Design & proof** (Review-proof CTA) → Book shipped home; diy = Order placed → Building your book → Design & proof → Book shipped home. A demo "Advance ▸" control steps stages forward.
- **Book** — three states gated by progress: **pending** ("Your proof isn't ready yet"); **review** ("We designed your book" — cover mockup + spread thumbnails, or, for DIY, a "From your uploads" grid of the user's real photos; sticky footer "Request a tweak" + "Approve & print"); **approved** (success — "Proof approved!"). A green dot badges the Book tab when a proof is ready.
- **Account** — "Hi there 👋"; pink **current-order card** (route-aware label + status + "View tracker →"); prominent **"＋ Create a new book"** (→ `choose`); "Digital gallery" row (Soon); **Your books** list (past books with Download / Reorder); settings rows (Language English · Français, Email); **Sign out** (→ `auth`); "Start a new demo order" reset.

### Interactions & Behavior
- Navigation is state-driven (no router); back buttons set `screen` to the prior step.
- Selections are immediate on tap; option cards show a 2px accent border + checkmark/filled radio when active; live totals recompute on every change.
- Upload: drag-over highlights the dropzone; dropped/selected images decode to thumbnails; × removes one.
- Proof approval flips Book → approved and advances the tracker to production.
- Success screens use a pop/scale-in on the check icon; the current tracker dot uses a pulsing ring (`@keyframes`).
- Focus rings on every control; buttons have hover states as tokened above.

### State Management
- `screen` (`auth|choose|details|gallery|billing|confirmation|app`), `tab` (`track|book|account`), `route` (`mail|diy`).
- Order data: `qty`, `returnArt`, `up` (upgrade flags), `speed`, `diyFormat`, `promoApplied`, `ship{}`, `card{}`, `auth{}`/`authMode`, `photos[]` (session-only), `approved`, `stageIndex`, `orderNo`.
- Totals (subtotal, HST 13%, total) are **derived** from the above, per route — not stored.
- Persistence: everything except `photos` is written to `localStorage` (`artbox-proto`) so a returning user resumes; on load, an invalid/old shape falls back to defaults. Reproduce with whatever persistence the target app uses (or omit for a first pass).

---

## Assets
- **Fonts:** Poppins via Google Fonts (self-host or use the platform font system in the real app).
- **Icons:** inline SVG (stroke-style line icons; Google/Apple brand marks on the auth screen). Swap for the codebase's icon set.
- **Photography:** all photo/book/mosaic visuals are **CSS/placeholder art** — replace with real product photography and lifestyle images. Placeholders are labelled where they appear.
- No external image files are referenced.

## Files
```
designs/
  ArtBox-landing.dc.html   # Landing — source (read for structure, inline styles = tokens, copy)
  ArtBox-app.dc.html       # Ordering app — source (all screens/flows above)
  support.js               # Component runtime required to RUN the .dc.html sources locally
preview/
  ArtBox-landing.html      # Landing — self-contained, open in any browser (offline)
  ArtBox-app.html          # App — self-contained, open in any browser (offline)
```
Tip for Cursor: keep this folder in the repo and reference `@designs/ArtBox-landing.dc.html`, `@designs/ArtBox-app.dc.html`, or `@designs/` (whole folder) in chat. Open the `preview/*.html` files in a browser to see the designs live. (The two preview files are each self-contained; the cross-page "Log in" / "Start your ArtBox" links between them won't navigate across the two standalone files, but every screen is reachable within each.)
