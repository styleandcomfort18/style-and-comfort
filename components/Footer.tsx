import Link from "next/link";
import Image from "next/image";
import { CATEGORY_LABELS } from "@/lib/seed-products";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Image src="/logo.jpg" alt="Style & Comfort" width={36} height={36} className="rounded-full" />
            <h4 className="font-display font-bold text-lg">Style & Comfort</h4>
          </div>
          <p className="text-sm text-brand-white/70 mt-2">
            Fashion & everyday essentials, delivered across Guyana.
          </p>
        </div>

        <div className="text-sm">
          <p className="font-semibold mb-2">Shop</p>
          <div className="flex flex-col gap-1">
            {Object.entries(CATEGORY_LABELS).map(([slug, label]) => (
              <Link key={slug} href={`/category/${slug}`} className="text-brand-white/70 hover:text-white">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="text-sm space-y-1">
          <p className="font-semibold mb-1">Contact</p>
          <p>WhatsApp: +592 621 1289</p>
          <p>infostyleandcomfort@gmail.com</p>
          <p className="pt-2">@styleandcomfort</p>
          <p className="text-brand-white/70 text-xs">Facebook · Instagram · TikTok</p>
        </div>

        <div className="text-sm">
          <p className="font-semibold mb-1">Store</p>
          <Link href="/admin/login" className="text-brand-white/60 hover:text-brand-white">
            Admin login
          </Link>
        </div>
      </div>
      <div className="text-center text-xs text-brand-white/50 py-4 border-t border-white/10">
        © {new Date().getFullYear()} Style & Comfort
      </div>
    </footer>
  );
}
