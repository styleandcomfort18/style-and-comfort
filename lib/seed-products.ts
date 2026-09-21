import { Product } from "./types";

// PLACEHOLDER DATA — ported from the original design's categories so the
// site is browsable during development. Replace with real products (via
// the admin dashboard, once wired to Supabase) once sizes/prices are sent.
// Pricing below is illustrative only: wholesale/reseller = rough discount
// off retail until real numbers are provided.

export const SEED_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Classic Oxford Shirt",
    category: "men",
    sub: "Shirts",
    images: ["/placeholder/shirt1.jpg"],
    description:
      "Breathable cotton-blend shirt, tailored fit, perfect for work or weekend wear.",
    variants: [
      { size: "S", stock: 6 },
      { size: "M", stock: 10 },
      { size: "L", stock: 8 },
      { size: "XL", stock: 4 },
    ],
    pricing: { retail: 4500, wholesale: 3900, reseller: 3400 },
  },
  {
    id: "p2",
    name: "Slim Fit Denim Jeans",
    category: "men",
    sub: "Jeans & Pants",
    images: ["/placeholder/jeans1.jpg"],
    description: "Stretch denim, tapered leg, everyday wear.",
    variants: [
      { size: "30", stock: 5 },
      { size: "32", stock: 7 },
      { size: "34", stock: 6 },
      { size: "36", stock: 3 },
    ],
    pricing: { retail: 6200, wholesale: 5400, reseller: 4700 },
  },
  {
    id: "p3",
    name: "5-a-side Cricket Jersey",
    category: "men",
    sub: "Cricket Jersey",
    images: ["/placeholder/jersey1.jpg"],
    description: "Breathable team jersey, moisture-wicking fabric.",
    variants: [
      { size: "M", stock: 12 },
      { size: "L", stock: 10 },
      { size: "XL", stock: 6 },
    ],
    pricing: { retail: 5800, wholesale: 5000, reseller: 4400 },
  },
  {
    id: "w1",
    name: "Floral Wrap Dress",
    category: "women",
    sub: "Dresses",
    images: ["/placeholder/dress1.jpg"],
    description: "Lightweight, flattering wrap dress for everyday wear.",
    variants: [
      { size: "S", stock: 8 },
      { size: "M", stock: 8 },
      { size: "L", stock: 5 },
    ],
    pricing: { retail: 6800, wholesale: 5900, reseller: 5100 },
  },
  {
    id: "k1",
    name: "Kids School Shirt",
    category: "kids",
    sub: "School Items",
    images: ["/placeholder/kidsshirt1.jpg"],
    description: "Durable, easy-wash school shirt.",
    variants: [
      { size: "6", stock: 10 },
      { size: "8", stock: 10 },
      { size: "10", stock: 8 },
    ],
    pricing: { retail: 3400, wholesale: 2900, reseller: 2500 },
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  men: "Men's Collection",
  women: "Women's Collection",
  kids: "Kids Collection",
  electronics: "Electronic Items",
  footwear: "Footwear",
  bags: "Bags",
  socks: "Socks",
  bedsheets: "Bedsheets",
};

// Sub-categories shown as filter tabs on each category page.
// Matches the original design exactly. Products are tagged with a `sub`
// value (e.g. "Jeans & Pants") which should be one of the strings below
// for that category, so the tabs actually filter correctly.
export const CATEGORY_SUBS: Record<string, string[]> = {
  men: ["Shirts", "T-Shirts & Tops", "Jeans & Pants", "Jerseys", "Accessories", "Belts", "Face Masks", "Shorts"],
  women: ["Dresses", "Tops", "Bottoms", "Activewear", "Accessories"],
  kids: ["School Uniforms", "School Boots", "Casual Wear", "Footwear", "Tops", "Basic Tees"],
  footwear: ["Sneakers", "Slippers", "Boots", "Sandals"],
  bags: ["Handbags", "Backpacks", "Wallets"],
  socks: ["Ankle Socks", "Crew Socks", "Novelty Socks"],
  bedsheets: ["Single", "Double", "Queen", "King"],
  electronics: ["Phone Accessories", "Earphones & Speakers", "Chargers & Cables", "Gadgets"],
};
