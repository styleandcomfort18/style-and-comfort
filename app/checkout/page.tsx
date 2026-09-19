"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { getDeliveryZones, placeOrder } from "@/lib/data";

const fmt = (n: number) => `$${n.toLocaleString()} GYD`;

interface Zone {
  zone_name: string;
  price: number;
}

// Wholesale rule: 3+ units of the SAME product (any mix of sizes) -> wholesale price.
function computeLineTotals(lines: ReturnType<typeof useCart>["lines"]) {
  const qtyByProduct: Record<string, number> = {};
  lines.forEach((l) => {
    qtyByProduct[l.productId] = (qtyByProduct[l.productId] ?? 0) + l.qty;
  });

  return lines.map((l) => {
    const totalQtyForItem = qtyByProduct[l.productId];
    const isWholesale = totalQtyForItem >= 3;
    // Uses the retail price already carried in the cart line, discounted
    // as a placeholder ratio. Once the product record is looked up at
    // checkout time this can pull the exact wholesale_price instead.
    const unitPrice = isWholesale
      ? Math.round(l.unitRetailPrice * 0.88)
      : l.unitRetailPrice;
    return { ...l, unitPrice, isWholesale, lineTotal: unitPrice * l.qty };
  });
}

export default function CheckoutPage() {
  const { lines, clear } = useCart();
  const router = useRouter();
  const [zones, setZones] = useState<Zone[]>([]);
  const [zone, setZone] = useState("");
  const [payment, setPayment] = useState<"COD" | "MMG">("COD");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getDeliveryZones()
      .then((z) => {
        setZones(z);
        if (z.length > 0) setZone(z[0].zone_name);
      })
      .catch(() => setError("Could not load delivery areas — check your connection."));
  }, []);

  const priced = useMemo(() => computeLineTotals(lines), [lines]);
  const subtotal = priced.reduce((sum, l) => sum + l.lineTotal, 0);
  const deliveryFee = zones.find((z) => z.zone_name === zone)?.price ?? 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!name || !phone || !address) {
      setError("Please fill in your name, phone and delivery address.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await placeOrder({
        customer_name: name,
        customer_phone: phone,
        delivery_address: address,
        delivery_zone: zone,
        delivery_fee: deliveryFee,
        payment_method: payment,
        subtotal,
        total,
        items: priced.map((l) => ({
          product_id: l.productId,
          product_name: l.name,
          size: l.size,
          quantity: l.qty,
          unit_price: l.unitPrice,
          line_total: l.lineTotal,
        })),
      });
      clear();
      router.push("/order-confirmed");
    } catch (e) {
      setError("Something went wrong placing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-brand-text/60">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display font-bold text-2xl text-brand-dark mb-6">Checkout</h1>

      <div className="space-y-3 mb-8">
        {priced.map((l, i) => (
          <div key={i} className="flex justify-between items-center border border-brand-border rounded-card p-3">
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

      <div className="space-y-3 mb-6">
        <input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-brand-border rounded-card p-3"
        />
        <input
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-brand-border rounded-card p-3"
        />
        <input
          placeholder="Delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border border-brand-border rounded-card p-3"
        />
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium block mb-2">Delivery area</label>
        <select
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          className="w-full border border-brand-border rounded-card p-3"
        >
          {zones.map((z) => (
            <option key={z.zone_name} value={z.zone_name}>
              {z.zone_name} — {fmt(z.price)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium block mb-2">Payment method</label>
        <div className="flex gap-3">
          <button
            onClick={() => setPayment("COD")}
            className={`flex-1 py-3 rounded-card border font-medium ${
              payment === "COD" ? "bg-brand-primary text-white border-brand-primary" : "border-brand-border"
            }`}
          >
            Cash on Delivery
          </button>
          <button
            onClick={() => setPayment("MMG")}
            className={`flex-1 py-3 rounded-card border font-medium ${
              payment === "MMG" ? "bg-brand-primary text-white border-brand-primary" : "border-brand-border"
            }`}
          >
            MMG
          </button>
        </div>
        {payment === "MMG" && (
          <p className="text-xs text-brand-text/60 mt-2">
            After placing your order, we'll follow up with our MMG number to complete payment.
          </p>
        )}
      </div>

      <div className="border-t border-brand-border pt-4 space-y-1 mb-6">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Delivery ({zone || "—"})</span>
          <span>{fmt(deliveryFee)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg text-brand-dark">
          <span>Total</span>
          <span>{fmt(total)}</span>
        </div>
      </div>

      {error && <p className="text-brand-accent text-sm mb-4">{error}</p>}

      <button
        onClick={handlePlaceOrder}
        disabled={submitting}
        className="btn-primary w-full bg-brand-primary text-white font-semibold py-3 rounded-card disabled:opacity-60"
      >
        {submitting ? "Placing order..." : "Place order"}
      </button>
    </div>
  );
}
