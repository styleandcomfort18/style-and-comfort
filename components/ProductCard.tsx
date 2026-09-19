"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const fmt = (n: number) => `$${n.toLocaleString()} GYD`;

export interface DbProduct {
  id: string;
  name: string;
  sub: string;
  images: string[];
  retail_price: number;
  wholesale_price: number;
  reseller_price: number;
}

export default function ProductCard({ product }: { product: DbProduct }) {
  const { addLine } = useCart();
  const [added, setAdded] = useState(false);
  const image = product.images?.[0] || "/placeholder/default.jpg";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addLine({
      productId: product.id,
      name: product.name,
      size: "One Size",
      unitRetailPrice: product.retail_price,
      qty: 1,
      image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="prod-card relative block bg-brand-white rounded-card border border-brand-border overflow-hidden"
    >
      <span className="absolute top-2 left-2 z-10 bg-brand-dark/90 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
        3+ = wholesale
      </span>
      <div className="aspect-[4/5] bg-brand-light overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={product.name}
          className="prod-img w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <p className="text-xs text-brand-primary font-semibold uppercase tracking-wide">
          {product.sub}
        </p>
        <h3 className="font-display font-semibold text-brand-text mt-0.5">
          {product.name}
        </h3>
        <div className="text-amber-500 text-xs mt-1">★★★★★</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-bold text-brand-dark">
            {fmt(product.retail_price)}
          </span>
        </div>
        <button
          onClick={handleQuickAdd}
          className="btn-primary mt-2 w-full bg-brand-primary text-white text-sm font-semibold py-2 rounded-full"
        >
          {added ? "Added ✓" : "Add to cart"}
        </button>
      </div>
    </Link>
  );
}
