"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { CATEGORY_SUBS } from "@/lib/seed-products";

interface Props {
  slug: string;
  label: string;
  products: any[];
}

export default function CategoryClient({ slug, label, products }: Props) {
  const searchParams = useSearchParams();
  const [activeSub, setActiveSub] = useState("All");
  const subs = CATEGORY_SUBS[slug] || [];
  const tabs = ["All", ...subs];

  useEffect(() => {
    const fromUrl = searchParams.get("sub");
    if (fromUrl && subs.includes(fromUrl)) setActiveSub(fromUrl);
  }, [searchParams, subs]);

  const filtered = useMemo(() => {
    if (activeSub === "All") return products;
    return products.filter((p) => p.sub === activeSub);
  }, [products, activeSub]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <p className="text-xs text-brand-text/60 mb-1">Home &gt; {label}</p>
      <h1 className="font-display font-bold text-2xl text-brand-dark mb-6">
        {label}
      </h1>

      {/* Sub-category pill tabs, matching the original design */}
      {tabs.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSub(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                activeSub === tab
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-white text-brand-text border-brand-border hover:border-brand-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-brand-text/60 text-center py-16">
          {products.length === 0
            ? "No items here yet — check back soon."
            : "No products in this section yet — check back soon."}
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
