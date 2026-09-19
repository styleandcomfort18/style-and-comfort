"use client";
import { useEffect, useState } from "react";

const SLIDES = [
  "Men, Women & Kids — all under one roof",
  "Uniforms & school boots ready to go",
  "Electronics have landed",
  "3+ of the same style & size = wholesale pricing",
  "COD, MMG & island-wide delivery",
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((prev) => (prev + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="bg-brand-light">
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display font-extrabold text-3xl md:text-5xl text-brand-dark min-h-[3.5rem] md:min-h-[4.5rem] transition-all">
          {SLIDES[i]}
        </h1>
        <p className="mt-3 text-brand-text/80 max-w-xl mx-auto">
          Everyday fashion for the whole family — delivered anywhere in Guyana.
          Pay by COD or MMG.
        </p>
        <div className="flex justify-center gap-2 mt-6">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                idx === i ? "bg-brand-primary" : "bg-brand-border"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
