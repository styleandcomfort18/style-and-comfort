"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const fmt = (n: number) => `$${n.toLocaleString()} GYD`;

export default function CartDrawer() {
  const { lines, cartOpen, closeCart, updateQty, removeLine } = useCart();

  if (!cartOpen) return null;

  const qualifiesWholesale = (() => {
    const qtyByProduct: Record<string, number> = {};
    lines.forEach((l) => {
      qtyByProduct[l.productId] = (qtyByProduct[l.productId] ?? 0) + l.qty;
    });
    return Object.values(qtyByProduct).some((q) => q >= 3);
  })();

  const total = lines.reduce((sum, l) => sum + l.unitRetailPrice * l.qty, 0);

  return (
    <div className="fixed inset-0 z-[200]">
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/45"
        style={{ animation: "fadeIn 0.2s ease" }}
      />
      <div
        className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white flex flex-col"
        style={{ animation: "slideIn 0.3s ease" }}
      >
        <div className="p-4 border-b border-brand-border flex justify-between items-center">
          <h3 className="font-display font-bold text-base">
            Your cart ({lines.length})
          </h3>
          <button onClick={closeCart} className="text-xl leading-none">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {qualifiesWholesale && (
            <div className="bg-brand-light border border-brand-border rounded-lg px-3 py-2.5 text-xs font-semibold text-brand-dark mb-4 flex items-center gap-2">
              📦 Wholesale pricing applied on qualifying items
            </div>
          )}

          {lines.length === 0 ? (
            <div className="text-center text-brand-text/50 py-12">
              <div className="text-4xl mb-3 opacity-40">🛒</div>
              <p>Your cart is empty.</p>
            </div>
          ) : (
            lines.map((item, i) => (
              <div
                key={i}
                className="flex gap-3 mb-4 pb-4 border-b border-brand-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image || "/placeholder/default.jpg"}
                  alt={item.name}
                  className="w-[60px] h-[74px] object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-1">{item.name}</p>
                  <p className="text-xs text-brand-text/60 mb-1">Size {item.size}</p>
                  <p className="text-sm text-brand-dark font-mono mb-2">
                    {fmt(item.unitRetailPrice)}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-brand-border rounded-lg">
                      <button
                        onClick={() => updateQty(item.productId, item.size, -1)}
                        className="px-2 py-1"
                      >
                        −
                      </button>
                      <span className="text-xs min-w-[18px] text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.productId, item.size, 1)}
                        className="px-2 py-1"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeLine(item.productId, item.size)}
                      className="ml-auto text-brand-accent text-sm"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {lines.length > 0 && (
          <div className="p-4 border-t border-brand-border">
            <div className="flex justify-between mb-3 text-base font-bold">
              <span>Subtotal</span>
              <span className="font-mono">{fmt(total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary block text-center w-full bg-brand-primary text-white py-3 rounded-xl font-bold"
            >
              Go to checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
