import { NextRequest, NextResponse } from "next/server";

// This runs on the SERVER, never in the browser — so the Resend API key
// stays private. It's called from lib/data.ts right after an order saves.
//
// SETUP NEEDED (see README):
// 1. Create a free account at resend.com
// 2. Add RESEND_API_KEY to your Vercel project's Environment Variables
// 3. Add STORE_NOTIFY_EMAIL and DELIVERY_PARTNER_EMAIL the same way
//    (delivery partner's email can be changed any time — no code needed,
//    just update the environment variable in Vercel and redeploy)

export async function POST(req: NextRequest) {
  try {
    const { order, items } = await req.json();

    const apiKey = process.env.RESEND_API_KEY;
    const storeEmail = process.env.STORE_NOTIFY_EMAIL || "infostyleandcomfort@gmail.com";
    const deliveryEmail = process.env.DELIVERY_PARTNER_EMAIL;

    if (!apiKey) {
      // Not configured yet — order is already saved in the database either way.
      return NextResponse.json({ skipped: true, reason: "RESEND_API_KEY not set" });
    }

    const itemsList = items
      .map((i: any) => `${i.quantity} × ${i.product_name} (Size ${i.size}) — $${i.line_total} GYD`)
      .join("\n");

    const emailBody = `
New order received!

Customer: ${order.customer_name}
Phone: ${order.customer_phone}
Address: ${order.delivery_address}
Delivery area: ${order.delivery_zone} ($${order.delivery_fee} GYD)
Payment method: ${order.payment_method}

Items:
${itemsList}

Subtotal: $${order.subtotal} GYD
Total: $${order.total} GYD

Order ID: ${order.id}
    `.trim();

    const recipients = [storeEmail, deliveryEmail].filter(Boolean);

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Style & Comfort <orders@yourverifieddomain.com>",
        to: recipients,
        subject: `New order from ${order.customer_name} — $${order.total} GYD`,
        text: emailBody,
      }),
    });

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("notify-order error:", err);
    // Never fail the order because of an email issue.
    return NextResponse.json({ sent: false }, { status: 200 });
  }
}
