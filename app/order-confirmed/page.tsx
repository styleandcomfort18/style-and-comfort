"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const WHATSAPP_NUMBER = "5926211289";
const fmt = (n: number) => `$${n.toLocaleString()} GYD`;

function ConfirmationContent() {
  const params = useSearchParams();
  const id = params.get("id") || "";
  const total = Number(params.get("total") || 0);
  const phone = params.get("phone") || "";
  const zone = params.get("zone") || "";

  const shortId = id ? id.slice(0, 8) : "";
  const waText = encodeURIComponent(
    `Hi Style & Comfort! I just placed order ${shortId} for ${fmt(total)}. Confirming details.`
  );

  return (
    <div className="fade-page max-w-xl mx-auto px-4 py-16 text-center">
      <div
        className="w-[70px] h-[70px] rounded-full bg-brand-lime flex items-center justify-center mx-auto mb-5"
        style={{ animation: "popIn 0.4s ease" }}
      >
        <span className="text-3xl text-brand-dark">✓</span>
      </div>
      <h1 className="font-display font-bold text-2xl text-brand-dark mb-2">
        Order placed!
      </h1>
      <p className="text-brand-text/70">
        Order <b className="font-mono">{shortId}</b> for <b>{fmt(total)}</b> is confirmed.
        We'll reach out at {phone} to arrange delivery to {zone}.
      </p>
      <div className="flex gap-3 justify-center mt-6 flex-wrap">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
          target="_blank"
          rel="noreferrer"
          className="btn-primary bg-brand-whatsapp text-white font-bold px-6 py-3 rounded-full flex items-center gap-2"
        >
          💬 Message us on WhatsApp
        </a>
        <Link
          href="/"
          className="btn-primary bg-brand-primary text-white font-bold px-6 py-3 rounded-full"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-brand-text/60">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
