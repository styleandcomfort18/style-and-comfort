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
  const [added, setAdded] = useState(false);
  const image = product.images?.[0] || "/placeholder/default.jpg";

  const handleAdd = () => {
    if (!size) return;
    addLine({
      productId: product.id,
      name: product.name,
      size,
      unitRetailPrice: product.retail_price,
      qty: 1,
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

        <button
          onClick={handleAdd}
          disabled={!size}
          className="btn-primary mt-6 w-full bg-brand-primary text-white font-semibold py-3 rounded-card disabled:opacity-50"
        >
          {added ? "Added ✓" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
