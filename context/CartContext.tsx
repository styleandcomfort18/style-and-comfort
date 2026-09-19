"use client";
import { createContext, useContext, useEffect, useState } from "react";

export interface CartLine {
  productId: string;
  name: string;
  size: string;
  unitRetailPrice: number;
  qty: number;
}

interface CartContextType {
  lines: CartLine[];
  addLine: (line: CartLine) => void;
  removeLine: (productId: string, size: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  // Cart lives in the browser only (localStorage) — fine for an in-progress
  // cart. Actual ORDERS get written to Supabase at checkout, not here.
  useEffect(() => {
    const saved = localStorage.getItem("sc_cart");
    if (saved) {
      try {
        setLines(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sc_cart", JSON.stringify(lines));
  }, [lines]);

  const addLine = (line: CartLine) => {
    setLines((prev) => {
      const existing = prev.find(
        (l) => l.productId === line.productId && l.size === line.size
      );
      if (existing) {
        return prev.map((l) =>
          l === existing ? { ...l, qty: l.qty + line.qty } : l
        );
      }
      return [...prev, line];
    });
  };

  const removeLine = (productId: string, size: string) => {
    setLines((prev) =>
      prev.filter((l) => !(l.productId === productId && l.size === size))
    );
  };

  const clear = () => setLines([]);

  return (
    <CartContext.Provider value={{ lines, addLine, removeLine, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
