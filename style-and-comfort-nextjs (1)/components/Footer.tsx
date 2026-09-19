import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <h4 className="font-display font-bold text-lg">Style &amp; Comfort</h4>
          <p className="text-sm text-brand-white/70 mt-2">
            Fashion &amp; everyday essentials, delivered across Guyana.
          </p>
        </div>
        <div className="text-sm space-y-1">
          <p className="font-semibold mb-1">Contact</p>
          <p>+592 621 1289</p>
          <p>infostyleandcomfort@gmail.com</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold mb-1">Store</p>
          <Link href="/admin/login" className="text-brand-white/60 hover:text-brand-white">
            Admin login
          </Link>
        </div>
      </div>
      <div className="text-center text-xs text-brand-white/50 py-4 border-t border-white/10">
        © {new Date().getFullYear()} Style &amp; Comfort
      </div>
    </footer>
  );
}
