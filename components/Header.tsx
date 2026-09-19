"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { CATEGORY_LABELS, CATEGORY_SUBS } from "@/lib/seed-products";
import { useCart } from "@/context/CartContext";

const TICKER_TEXT =
  "Buy 3+ of the same style & size — wholesale pricing  •  Cash on delivery available  •  MMG payments accepted  •  Delivery across Guyana  •  Men, Women, Kids, Footwear, Bags, Accessories, Electronics — one store";

export default function Header() {
  const categories = Object.keys(CATEGORY_LABELS);
  const { lines, toggleCart } = useCart();
  const [openCat, setOpenCat] = useState<string | null>(null);
  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);

  return (
    <div className="sticky top-0 z-50">
      {/* Scrolling ticker */}
      <div className="bg-brand-dark text-white text-xs overflow-hidden whitespace-nowrap">
        <div className="ticker-track py-1.5 inline-block">
          <span className="mx-8">{TICKER_TEXT}</span>
          <span className="mx-8">{TICKER_TEXT}</span>
        </div>
      </div>

      <header className="bg-brand-white/95 backdrop-blur border-b border-brand-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/logo.jpg" alt="Style & Comfort" width={44} height={44} className="rounded-full" />
            <span className="hidden sm:block font-display font-extrabold text-lg text-brand-dark">
              Style & Comfort
            </span>
          </Link>

          <div className="flex-1 hidden md:block">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full border border-brand-border rounded-full px-4 py-2 text-sm bg-brand-light/50 focus:outline-none focus:border-brand-primary"
            />
          </div>

          <button
            onClick={toggleCart}
            aria-label="Cart"
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-brand-light text-brand-dark shrink-0"
          >
            🛒
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Category nav with dropdown sub-categories */}
        <nav className="border-t border-brand-border">
          <div className="max-w-6xl mx-auto px-4 flex flex-wrap gap-1 text-sm font-medium text-brand-text">
            {categories.map((cat) => (
              <div
                key={cat}
                className="relative"
                onMouseEnter={() => setOpenCat(cat)}
                onMouseLeave={() => setOpenCat(null)}
              >
                <Link
                  href={`/category/${cat}`}
                  className="block px-3 py-2 hover:text-brand-primary transition-colors"
                >
                  {CATEGORY_LABELS[cat]}
                </Link>
                {openCat === cat && CATEGORY_SUBS[cat]?.length > 0 && (
                  <div className="absolute left-0 top-full bg-white border border-brand-border rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                    {CATEGORY_SUBS[cat].map((sub) => (
                      <Link
                        key={sub}
                        href={`/category/${cat}?sub=${encodeURIComponent(sub)}`}
                        className="block px-4 py-1.5 text-sm text-brand-text hover:bg-brand-light hover:text-brand-primary"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      </header>
    </div>
  );
}
