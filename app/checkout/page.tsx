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

function computeLineTotals(lines: ReturnType<typeof useCart>["lines"]) {
  const qtyByProduct: Record<string, number> = {};
  lines.forEach((l) => {
    qtyByProduct[l.productId] = (qtyByProduct[l.productId] ?? 0) + l.qty;
  });
  return lines.map((l) => {
    const totalQtyForItem = qtyByProduct[l.productId];
    const isWholesale = totalQtyForItem >= 3;
    const unitPrice = isWholesale
      ? Math.round(l.unitRetailPrice * 0.88)
      : l.unitRetailPrice;
    return { ...l, unitPrice, isWholesale, lineTotal: unitPrice * l.qty };
  });
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="text-xs font-semibold text-brand-text/70 block mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-brand-accent text-xs mt-1">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border-[1.5px] border-brand-border text-sm outline-none focus:border-brand-primary";

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getDeliveryZones()
      .then((z) => {
        setZones(z);
        if (z.length > 0) setZone(z[0].zone_name);
      })
      .catch(() => setErrors((e) => ({ ...e, zones: "Could not load delivery areas." })));
  }, []);

  const priced = useMemo(() => computeLineTotals(lines), [lines]);
  const subtotal = priced.reduce((sum, l) => sum + l.lineTotal, 0);
  const deliveryFee = zones.find((z) => z.zone_name === zone)?.price ?? 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Enter your full name";
    if (!phone.trim()) errs.phone = "Enter a phone number";
    if (!address.trim()) errs.address = "Enter your delivery address";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setErrors({});
    try {
      const order = await placeOrder({
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
      router.push(`/order-confirmed?id=${order.id}&total=${total}&phone=${encodeURIComponent(phone)}&zone=${encodeURIComponent(zone)}`);
    } catch (e) {
      setErrors({ submit: "Something went wrong placing your order. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="fade-page max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-4xl mb-3 opacity-30">🛒</div>
        <h2 className="font-display font-bold text-2xl text-brand-dark">Your cart is empty</h2>
        <p className="text-brand-text/60 mt-2">Add something you love before checking out.</p>
      </div>
    );
  }

  return (
    <div className="fade-page max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-[1.4fr_1fr] gap-10">
      <div>
        <h1 className="font-display font-bold text-2xl text-brand-dark mb-5">Checkout</h1>

        {/* Delivery details card */}
        <div className="bg-white border border-brand-border rounded-2xl p-5 mb-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            📍 Delivery details
          </h3>
          <Field label="Full name" error={errors.name}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="e.g. Devika Persaud"
            />
          </Field>
          <Field label="Phone number" error={errors.phone}>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="e.g. 592 600 1234"
            />
          </Field>
          <Field label="Delivery address" error={errors.address}>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={inputClass}
              placeholder="Lot, street, village/town"
            />
          </Field>
          <Field label="Delivery area">
            <select value={zone} onChange={(e) => setZone(e.target.value)} className={inputClass}>
              {zones.map((z) => (
                <option key={z.zone_name} value={z.zone_name}>
                  {z.zone_name} — {fmt(z.price)}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Payment method card */}
        <div className="bg-white border border-brand-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            💳 Payment method
          </h3>
          {[
            { id: "COD" as const, label: "Cash on delivery" },
            { id: "MMG" as const, label: "MMG payment" },
          ].map((opt) => (
            <label key={opt.id} className="flex items-center gap-2.5 py-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="pay"
                checked={payment === opt.id}
                onChange={() => setPayment(opt.id)}
              />
              {opt.label}
            </label>
          ))}
          <p className="text-xs text-brand-text/60 mt-2">
            Prefer to sort it out directly? You can also confirm payment with us on WhatsApp
            after ordering.
          </p>
        </div>
      </div>

      {/* Order summary, sticky */}
      <div>
        <div className="bg-brand-bg border border-brand-border rounded-2xl p-5 sticky top-24">
          <h3 className="text-sm font-semibold mb-4">Order summary</h3>
          {priced.map((l, i) => (
            <div key={i} className="flex justify-between text-sm mb-2.5">
              <span>
                {l.name} × {l.qty}
                {l.isWholesale && <span className="text-brand-primary font-semibold"> (wholesale)</span>}
              </span>
              <span className="font-mono">{fmt(l.lineTotal)}</span>
            </div>
          ))}
          <div className="border-t border-brand-border my-3 pt-3 flex justify-between text-sm">
            <span>Delivery ({zone || "—"})</span>
            <span className="font-mono">{fmt(deliveryFee)}</span>
          </div>
          <div className="border-t border-brand-border my-3 pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span className="font-mono">{fmt(total)}</span>
          </div>
          {errors.submit && <p className="text-brand-accent text-xs mb-2">{errors.submit}</p>}
          <button
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="btn-primary w-full bg-brand-primary text-white font-bold py-3.5 rounded-xl mt-2 disabled:opacity-60"
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </div>
      </div>
    </div>
  );
}
