import Link from "next/link";

export default function OrderConfirmedPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="text-5xl mb-4">✓</div>
      <h1 className="font-display font-bold text-2xl text-brand-dark mb-2">
        Order placed!
      </h1>
      <p className="text-brand-text/70 mb-8">
        Thank you for your order. We'll be in touch shortly to confirm
        delivery details.
      </p>
      <Link
        href="/"
        className="inline-block bg-brand-primary text-white font-semibold px-6 py-3 rounded-card"
      >
        Continue shopping
      </Link>
    </div>
  );
}
