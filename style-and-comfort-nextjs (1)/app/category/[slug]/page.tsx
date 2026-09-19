import ProductCard from "@/components/ProductCard";
import { SEED_PRODUCTS, CATEGORY_LABELS } from "@/lib/seed-products";
import { notFound } from "next/navigation";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const label = CATEGORY_LABELS[params.slug];
  if (!label) return notFound();

  const products = SEED_PRODUCTS.filter((p) => p.category === params.slug);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display font-bold text-2xl text-brand-dark mb-6">
        {label}
      </h1>
      {products.length === 0 ? (
        <p className="text-brand-text/60">
          No items here yet — check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
