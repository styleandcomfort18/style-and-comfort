import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/seed-products";

export default function Header() {
  const categories = Object.keys(CATEGORY_LABELS);

  return (
    <header className="sticky top-0 z-50 bg-brand-white/95 backdrop-blur border-b border-brand-border">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="font-display font-extrabold text-xl text-brand-dark">
          Style <span className="text-brand-primary">&amp;</span> Comfort
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-brand-text">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/category/${cat}`}
              className="hover:text-brand-primary transition-colors"
            >
              {CATEGORY_LABELS[cat]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/checkout"
            aria-label="Cart"
            className="icon-btn w-10 h-10 flex items-center justify-center rounded-full bg-brand-light text-brand-dark"
          >
            🛒
          </Link>
        </div>
      </div>
    </header>
  );
}
