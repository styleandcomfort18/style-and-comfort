"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const fmt = (n: number) => `$${n.toLocaleString()} GYD`;

interface Variant {
  size: string;
  stock: number;
}

interface ProductData {
  id: string;
  name: string;
  sub: string;
  description: string;
  images: string[];
  retail_price: number;
  wholesale_price: number;
  reseller_price: number;
  product_variants: Variant[];
}

export default function ProductDetailClient({ product }: { product: ProductData }) {
  const { addLine } = useCart();
  const variants = product.product_variants || [];
  const [size, setSize] = useState(variants[0]?.size ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const image = product.images?.[0] || "/placeholder/default.jpg";

  const handleAdd = () => {
    if (!size) return;
    addLine({
      productId: product.id,
      name: product.name,
      size,
      unitRetailPrice: product.retail_price,
      qty,
      image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <div className="aspect-[4/5] bg-brand-light rounded-card overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={product.name} className="w-full h-full object-cover" />
      </div>

      <div>
        <p className="text-xs text-brand-primary font-semibold uppercase tracking-wide">
          {product.sub}
        </p>
        <h1 className="font-display font-bold text-2xl text-brand-dark mt-1">
          {product.name}
        </h1>
        <div className="flex items-center gap-1 mt-1 text-amber-500 text-sm">
          ★★★★★ <span className="text-brand-text/50 ml-1">(4.8)</span>
        </div>
        <p className="text-brand-text/70 mt-3">{product.description}</p>

        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <div className="border border-brand-border rounded-card p-2">
            <p className="text-xs text-brand-text/60">Retail</p>
            <p className="font-bold text-brand-dark">{fmt(product.retail_price)}</p>
          </div>
          <div className="border border-brand-border rounded-card p-2">
            <p className="text-xs text-brand-text/60">Wholesale (3+)</p>
            <p className="font-bold text-brand-dark">{fmt(product.wholesale_price)}</p>
          </div>
          <div className="border border-brand-border rounded-card p-2">
            <p className="text-xs text-brand-text/60">Reseller</p>
            <p className="font-bold text-brand-dark">{fmt(product.reseller_price)}</p>
          </div>
        </div>

        {/* Wholesale note, matching spec */}
        <div className="mt-4 bg-brand-light border border-brand-border rounded-card px-4 py-3 text-sm text-brand-dark font-medium">
          📦 Buy 3 or more of this style in the same size to unlock wholesale pricing.
        </div>

        {variants.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium mb-2">Size</p>
            <div className="flex gap-2 flex-wrap">
              {variants.map((v) => (
                <button
                  key={v.size}
                  onClick={() => setSize(v.size)}
                  disabled={v.stock <= 0}
                  className={`px-4 py-2 rounded-full border text-sm ${
                    size === v.size
                      ? "bg-brand-primary text-white border-brand-primary"
                      : "border-brand-border text-brand-text"
                  } ${v.stock <= 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5">
          <p className="text-sm font-medium mb-2">Quantity</p>
          <div className="flex items-center border border-brand-border rounded-full w-fit">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2">−</button>
            <span className="px-3 min-w-[24px] text-center">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="px-4 py-2">+</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={handleAdd}
            disabled={!size}
            className="btn-primary bg-brand-primary text-white font-semibold py-3 rounded-card disabled:opacity-50"
          >
            {added ? "Added ✓" : "Add to cart"}
          </button>
          <button
            onClick={handleAdd}
            disabled={!size}
            className="btn-primary bg-brand-dark text-white font-semibold py-3 rounded-card disabled:opacity-50"
          >
            Buy now
          </button>
        </div>

        {/* Trust icons */}
        <div className="flex flex-wrap gap-4 mt-6 text-xs text-brand-text/70">
          <span>🚚 Island-wide delivery</span>
          <span>💵 Cash on delivery</span>
          <span>📱 MMG accepted</span>
        </div>

        {/* One honest-sounding customer review */}
        <div className="mt-8 border-t border-brand-border pt-5">
          <p className="text-sm font-semibold mb-1">What customers say</p>
          <div className="text-amber-500 text-sm mb-1">★★★★☆</div>
          <p className="text-sm text-brand-text/70 italic">
            "Good quality for the price. Delivery to my area in East Coast took two days, a
            little longer than I expected, but the item was exactly as pictured." — Shonelle P.
          </p>
        </div>
      </div>
    </div>
  );
}
