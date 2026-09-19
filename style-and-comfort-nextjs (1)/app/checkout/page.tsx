"use client";
import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { DELIVERY_ZONES } from "@/lib/delivery-zones";

const fmt = (n: number) => `$${n.toLocaleString()} GYD`;

// Wholesale rule: 3+ units of the SAME product (any mix of sizes) -> wholesale price.
// This groups cart lines by productId to count total quantity per item.
function computeLineTotals(lines: ReturnType<typeof useCart>["lines"]) {
  const qtyByProduct: Record<string, number> = {};
  lines.forEach((l) => {
    qtyByProduct[l.productId] = (qtyByProduct[l.productId] ?? 0) + l.qty;
  });

  return lines.map((l) => {
    const totalQtyForItem = qtyByProduct[l.productId];
    const isWholesale = totalQtyForItem >= 3;
    // NOTE: wholesale unit price should come from product.pricing.wholesale,
    // wired up once connected to the product database. Placeholder: 12% off.
    const unitPrice = isWholesale
      ? Math.round(l.unitRetailPrice * 0.88)
      : l.unitRetailPrice;
    return { ...l, unitPrice, isWholesale, lineTotal: unitPrice * l.qty };
  });
}

export default function CheckoutPage() {
  const { lines } = useCart();
  const [zone, setZone] = useState(DELIVERY_ZONES[0].zone);
  const [payment, setPayment] = useState<"COD" | "MMG">("COD");

  const priced = useMemo(() => computeLineTotals(lines), [lines]);
  const subtotal = priced.reduce((sum, l) => sum + l.lineTotal, 0);
  const deliveryFee = DELIVERY_ZONES.find((z) => z.zone === zone)?.price ?? 0;
  const total = subtotal + deliveryFee;

  if (lines.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-brand-text/60">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display font-bold text-2xl text-brand-dark mb-6">
        Checkout
      </h1>

      {/* Cart lines */}
      <div className="space-y-3 mb-8">
        {priced.map((l, i) => (
          <div
            key={i}
            className="flex justify-between items-center border border-brand-border rounded-card p-3"
          >
            <div>
              <p className="font-medium">{l.name}</p>
              <p className="text-xs text-brand-text/60">
                Size {l.size} × {l.qty}
                {l.isWholesale && (
                  <span className="text-brand-primary font-semibold"> · wholesale price applied</span>
                )}
              </p>
            </div>
            <p className="font-semibold">{fmt(l.lineTotal)}</p>
          </div>
        ))}
      </div>

      {/* Delivery zone */}
      <div className="mb-6">
        <label className="text-sm font-medium block mb-2">Delivery area</label>
        <select
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          className="w-full border border-brand-border rounded-card p-3"
        >
          {DELIVERY_ZONES.map((z) => (
            <option key={z.zone} value={z.zone}>
              {z.zone} — {fmt(z.price)}
            </option>
          ))}
        </select>
      </div>

      {/* Payment method */}
      <div className="mb-6">
        <label className="text-sm font-medium block mb-2">Payment method</label>
        <div className="flex gap-3">
          <button
            onClick={() => setPayment("COD")}
            className={`flex-1 py-3 rounded-card border font-medium ${
              payment === "COD"
                ? "bg-brand-primary text-white border-brand-primary"
                : "border-brand-border"
            }`}
          >
            Cash on Delivery
          </button>
          <button
            onClick={() => setPayment("MMG")}
            className={`flex-1 py-3 rounded-card border font-medium ${
              payment === "MMG"
                ? "bg-brand-primary text-white border-brand-primary"
                : "border-brand-border"
            }`}
          >
            MMG
          </button>
        </div>
        {payment === "MMG" && (
          <p className="text-xs text-brand-text/60 mt-2">
            You'll see our MMG number and a QR code on the next step. Send
            payment, then upload your payment screenshot to confirm the order.
          </p>
        )}
      </div>

      {/* Totals */}
      <div className="border-t border-brand-border pt-4 space-y-1 mb-6">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Delivery ({zone})</span>
          <span>{fmt(deliveryFee)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg text-brand-dark">
          <span>Total</span>
          <span>{fmt(total)}</span>
        </div>
      </div>

      <button className="btn-primary w-full bg-brand-primary text-white font-semibold py-3 rounded-card">
        Place order
      </button>
      <p className="text-xs text-brand-text/50 text-center mt-3">
        Placing this order will need to be wired to Supabase to actually save
        it and email you + your delivery partner — see README.
      </p>
    </div>
  );
}
