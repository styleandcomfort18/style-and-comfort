import Link from "next/link";

const fmt = (n: number) => `$${n.toLocaleString()} GYD`;

// Shape as it comes back from Supabase (see lib/data.ts)
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
  const image = product.images?.[0] || "/placeholder/default.jpg";
  return (
    <Link
      href={`/product/${product.id}`}
      className="prod-card block bg-brand-white rounded-card border border-brand-border overflow-hidden"
    >
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
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-bold text-brand-dark">
            {fmt(product.retail_price)}
          </span>
          <span className="text-xs text-brand-text/60">
            3+ same item: {fmt(product.wholesale_price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
