# Style & Comfort — Next.js Store

This is your store rebuilt in Next.js, with your green-and-white design
carried over exactly (colors, fonts, card style, layout).

## What's working right now
- Homepage with category tiles (men, women, kids, electronics, footwear, bags, socks, bedsheets)
- Category pages, product pages with size selection
- Cart (saved in the browser)
- Checkout page with a delivery-zone selector and COD/MMG choice
- Wholesale pricing rule: 3+ of the same item (any sizes) auto-applies the wholesale price

## What's placeholder, on purpose
- **Products**: 5 sample items are in `lib/seed-products.ts`, standing in for
  your real catalogue until you send sizes/prices.
- **Delivery zones**: `lib/delivery-zones.ts` has example zones/prices —
  swap in your real chart.
- **Admin login**: the page exists but isn't connected to anything yet.
- **Placing an order**: right now it calculates the total but doesn't save
  or email anything. This needs the database step below.

## Three things this project still needs before it's a real, live store

### 1. A database (Supabase) — so orders and products are actually saved
Without this, nothing a customer does is remembered.
1. Go to supabase.com → sign up free → "New project"
2. Once created, go to Project Settings → API — copy the "Project URL"
   and "anon public" key
3. Create a file named `.env.local` in this project's main folder with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. I'll then wire products, orders, and the admin dashboard to read/write
   here — this is the next step once you're ready.

Supabase also gives you a simple spreadsheet-style table view of your data
as a backup, in case anything ever needs a manual fix.

### 2. An email service (Resend) — so you and your delivery partner get notified
1. Go to resend.com → sign up free → verify your sending domain (or use
   their test domain while starting out)
2. Copy your API key into `.env.local`:
   ```
   RESEND_API_KEY=your-key-here
   ```
3. I'll wire this so placing an order emails you AND your delivery
   partner automatically — same idea as the Shopify feature you described.

### 3. Hosting on Vercel + connecting your domain
Vercel is where this Next.js project actually runs (your current hosting
cannot run this — only WordPress/PHP sites).

1. Go to vercel.com → sign up (free plan is enough to start)
2. Click "Add New Project" → connect it to this code (I'll help you get
   this project onto GitHub first, which Vercel needs)
3. Paste in the same `.env.local` values under Project Settings → Environment Variables
4. Click Deploy — Vercel gives you a working link immediately
   (like `style-and-comfort.vercel.app`)
5. To use your own domain: Project Settings → Domains → enter your domain
   → Vercel shows you 1-2 DNS records to add
6. Go to wherever you bought your domain (GoDaddy, Namecheap, etc.) → DNS
   settings → add those records exactly as shown
7. Takes anywhere from a few minutes to 24 hours to go live on your domain

## Running it on your own computer (optional, to preview before deploying)
```
npm install
npm run dev
```
Then open http://localhost:3000 in your browser.

## What I need from you to keep building
- Your delivery charge chart (areas + prices)
- Item sizes, and retail/wholesale/reseller prices, per category
- Your logo file
- Once ready: a Supabase account and a Resend account (both free to start)

Nothing above requires you to write or edit code — I'll do the wiring
once the accounts exist and the data is in hand.
