# Diamond Fibre: Official Web Application

Official production website for **Diamond Fibre**, a bedding manufacturing business established in 2018 in Ratlam, Madhya Pradesh, India.

- **Production Domain:** [https://diamond-fibre.vercel.app](https://diamond-fibre.vercel.app)
- **Primary Categories:** Mattresses (Gaddas), Pillows, Razais, and Blankets.

---

## Technology Stack

- **Framework:** Next.js 16 (App Router with Turbopack)
- **Runtime:** React 19 & TypeScript 5
- **Styling:** Tailwind CSS v4 (with `@theme` CSS variables design tokens)
- **Animations:** Motion (Framer Motion v14) with full `prefers-reduced-motion` compliance
- **Typography:** Manrope (headings), Inter (body UI), and Noto Sans Devanagari (Hindi) via `next/font/google`
- **Email Delivery:** Resend transactional email API with strict zero-PII logging and fallback to WhatsApp
- **Analytics:** Google Analytics 4 (`G-RCC1Y4HKY0`) & Microsoft Clarity (`z1mm5acuh0`) with client-side route tracking and privacy masking

---

## Architectural Highlights

1. **Bilingual Routing:** Complete parity across English (`/en`) and Hindi (`/hi`) with truthful bilingual schema and localized dictionaries.
2. **Four Core Bedding Categories:**
   - Mattresses / Gaddas (`/products/mattresses`) with 308 permanent redirect from `/products/gaddas`
   - Pillows (`/products/pillows`)
   - Razais (`/products/razais`)
   - Blankets (`/products/blankets`)
3. **SEO & Domain Guard:** [`src/lib/seo.ts`](src/lib/seo.ts) validates canonical production URLs and blocks deployment if unconfirmed placeholder domains are present.
4. **Wholesale Enquiry Boundary:** Server-side validation, honeypot bot trap, zero-PII operational logging, and graceful WhatsApp direct fallback.
5. **Session Privacy:** Microsoft Clarity session recordings enforce `data-clarity-mask="true"` on the wholesale enquiry form to prevent capturing customer personal details.

---

## Available Scripts

```bash
# Run local development server (http://localhost:3000)
npm run dev

# Run automated unit tests
npm test

# Run ESLint validation
npm run lint

# Run TypeScript compilation check
npx tsc --noEmit

# Create optimized production build
npm run build
```

---

## Environment Configuration

Copy `.env.example` to `.env.local` for local development:

```ini
NEXT_PUBLIC_SITE_URL=https://diamond-fibre.vercel.app
NEXT_PUBLIC_CONTACT_PHONE=+917974644185
NEXT_PUBLIC_WHATSAPP_NUMBER=917974644185
WHOLESALE_RECIPIENT_EMAIL=diamondfibreandcotton@gmail.com
RESEND_API_KEY=
WHOLESALE_FROM_EMAIL=
```

> **Security Note:** Secrets such as `RESEND_API_KEY` must remain server-side only and are excluded from Git by `.gitignore`.
