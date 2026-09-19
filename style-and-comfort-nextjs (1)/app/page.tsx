import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { SEED_PRODUCTS, CATEGORY_LABELS } from "@/lib/seed-products";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-light">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-brand-dark">
            Style &amp; Comfort
          </h1>
          <p className="mt-3 text-brand-text/80 max-w-xl mx-auto">
            Everyday fashion for the whole family — delivered anywhere in Guyana.
            Pay by COD or MMG.
          </p>
        </div>
      </section>

      {/* Category tiles */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="font-display font-bold text-xl text-brand-dark mb-4">
          Shop by category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(CATEGORY_LABELS).map(([slug, label]) => (
            <Link
              key={slug}
              href={`/category/${slug}`}
              className="cat-pill bg-brand-white border border-brand-border rounded-card p-4 text-center font-medium text-brand-text hover:border-brand-primary"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="font-display font-bold text-xl text-brand-dark mb-4">
          Featured items
        </h2>
        <div className="product-grid grid grid-cols-2 md:grid-cols-4 gap-4">
          {SEED_PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
