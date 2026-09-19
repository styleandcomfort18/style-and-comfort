"use client";
import { createContext, useContext, useEffect, useState } from "react";

export interface CartLine {
  productId: string;
  name: string;
  size: string;
  unitRetailPrice: number;
  qty: number;
  image?: string;
}

interface CartContextType {
  lines: CartLine[];
  addLine: (line: CartLine) => void;
  removeLine: (productId: string, size: string) => void;
  updateQty: (productId: string, size: string, delta: number) => void;
  clear: () => void;
  cartOpen: boolean;
  toggleCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

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
    setCartOpen(true); // matches original: adding an item opens the cart drawer
  };

  const removeLine = (productId: string, size: string) => {
    setLines((prev) =>
      prev.filter((l) => !(l.productId === productId && l.size === size))
    );
  };

  const updateQty = (productId: string, size: string, delta: number) => {
    setLines((prev) =>
      prev
        .map((l) =>
          l.productId === productId && l.size === size
            ? { ...l, qty: Math.max(1, l.qty + delta) }
            : l
        )
    );
  };

  const clear = () => setLines([]);
  const toggleCart = () => setCartOpen((o) => !o);
  const closeCart = () => setCartOpen(false);

  return (
    <CartContext.Provider
      value={{ lines, addLine, removeLine, updateQty, clear, cartOpen, toggleCart, closeCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
