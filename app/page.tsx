import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import { CATEGORY_LABELS } from "@/lib/seed-products";
import { getAllProducts } from "@/lib/data";

// Always fetch fresh data from the database — never freeze this page's
// product list at build time. Without this, newly added products
// wouldn't show up until the next deployment.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let products: any[] = [];
  try {
    products = await getAllProducts();
  } catch {
    // Database not seeded yet — page still renders, just with no products.
  }

  return (
    <div>
      <HeroCarousel />

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
              className="cat-pill bg-brand-white border border-brand-border rounded-card p-4 text-center font-medium text-brand-text hover:border-brand-primary hover:-translate-y-1 transition-transform"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* Wholesale callout banner */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-brand-dark text-white rounded-card px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-xl">
              Buy 3 or more, same style & size — get wholesale pricing
            </h3>
            <p className="text-white/70 text-sm mt-1">
              Perfect for families, teams, and resellers.
            </p>
          </div>
          <Link
            href="/category/men"
            className="btn-primary bg-white text-brand-dark font-semibold px-6 py-3 rounded-full whitespace-nowrap"
          >
            Shop now
          </Link>
        </div>
      </section>

      {/* Best sellers */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="font-display font-bold text-xl text-brand-dark mb-4">
          Best sellers
        </h2>
        {products.length === 0 ? (
          <p className="text-brand-text/60">
            No products yet — add some from the admin dashboard.
          </p>
        ) : (
          <div className="product-grid grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Trust badge row */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm text-brand-text/70">
          <div className="p-4">🚚<p className="mt-1 font-medium">Delivery across Guyana</p></div>
          <div className="p-4">📱<p className="mt-1 font-medium">MMG accepted</p></div>
          <div className="p-4">💵<p className="mt-1 font-medium">Cash on delivery</p></div>
          <div className="p-4">🏬<p className="mt-1 font-medium">One store, everything you need</p></div>
        </div>
      </section>
    </div>
  );
}
