# Style & Comfort — Next.js Store

Connected to your Supabase database. Products, orders, and delivery zones
are now real — not placeholder data.

## What's working now
- Homepage, category pages, and product pages load real data from your database
- Cart (saved in the browser) with size selection
- Checkout: real delivery zones, COD/MMG choice, wholesale pricing rule
  (3+ of the same item auto-applies the wholesale price)
- Orders are saved permanently to your database when a customer checks out
- Admin dashboard: add, edit, delete products; view and update order status
- Order email notifications (once Resend is connected — see below)

## Step 1 — Create your database tables (do this once)
1. In Supabase, go to **SQL Editor** (left sidebar) → **New query**
2. Open the file `supabase-schema.sql` from this project, copy everything in it
3. Paste into the SQL Editor → click **Run**
4. This creates all your tables (products, orders, delivery zones, etc.)
   and adds your delivery zones as a starting example — edit these any
   time from **Table Editor → delivery_zones**, no code needed

## Step 2 — Create your admin login (do this once)
1. In Supabase, go to **Authentication** (left sidebar) → **Users** → **Add user**
2. Enter your email and a password — this is what you'll use to log into
   `/admin/login` on your live site
3. That's it — no code involved

## Step 3 — Add your real products
Once deployed (Step 5), go to `yourdomain.com/admin/login`, log in, and
use **+ Add product** to enter your real items: name, category, prices
(retail/wholesale/reseller), description, and an image link.

Note: this version's admin form doesn't yet manage sizes/stock per item —
that's the next piece to add once your first products are in. For now,
sizes can be added directly in Supabase's Table Editor under
`product_variants` (one row per size, e.g. product + "M" + stock count).

## Step 4 — Email notifications (optional, can do later)
This sends you and your delivery partner an email every time an order
comes in.
1. Go to resend.com → sign up free → verify a sending domain (or use
   their test domain while starting out)
2. Copy your API key
3. In Vercel (once deployed): Project Settings → Environment Variables, add:
   ```
   RESEND_API_KEY=your-resend-key
   STORE_NOTIFY_EMAIL=infostyleandcomfort@gmail.com
   DELIVERY_PARTNER_EMAIL=your-delivery-partner@email.com
   ```
4. Redeploy — no code changes needed. To change the delivery partner's
   email later, just update that same value in Vercel and redeploy.

## Step 5 — Deploy to Vercel + connect your domain
1. Go to vercel.com → sign up → "Add New Project"
2. Connect this project (I'll help get it onto GitHub first if it isn't already)
3. Under Environment Variables, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://yniikmhqkqqchhgqwxlc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_zJvcVgJwEkRf65hTnOYg6w_VHREDNFq
   ```
   (plus the Resend ones from Step 4, once ready)
4. Click **Deploy** — you'll get a working link immediately
5. To use your own domain: Project Settings → Domains → enter your domain
   → Vercel shows 1-2 DNS records
6. Add those exact records at wherever you bought your domain (GoDaddy,
   Namecheap, etc.) under DNS settings
7. Takes minutes to 24 hours to go live on your domain

## Running it on your own computer (optional, to preview before deploying)
```
npm install
npm run dev
```
Open http://localhost:3000

## What's still needed from you
- Your delivery charge chart — update it directly in Supabase's
  Table Editor → delivery_zones (or send it here and I'll set it for you)
- Real item sizes/prices — add via admin dashboard + Table Editor (see Step 3)
- Your logo file
- A Resend account, once you're ready for order email alerts
