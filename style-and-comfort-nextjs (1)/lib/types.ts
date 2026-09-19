// Core data shapes for the store.
// "Sub" mirrors the sub-categories already used in the original design
// (e.g. men -> "Shirts", "Jeans & Pants", women -> "Dresses", kids -> "School Items")

export type Category =
  | "men"
  | "women"
  | "kids"
  | "electronics"
  | "footwear"
  | "bags"
  | "socks"
  | "bedsheets";

export type PriceTier = "retail" | "wholesale" | "reseller";

export interface ProductVariant {
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  sub: string; // e.g. "Jeans", "Cricket Jersey", "Vest", "School Items"
  images: string[];
  description: string;
  variants: ProductVariant[]; // sizes + stock per size

  // Three price tiers per product.
  // retailPrice: normal single-item price
  // wholesalePrice: applied automatically when the SAME item is bought
  //                  3+ times (any mix of sizes) in one order
  // resellerPrice: applied to customers tagged "reseller" in their account,
  //                 for bulk purchase intended for resale
  pricing: {
    retail: number;
    wholesale: number;
    reseller: number;
  };
}

// Wholesale trigger rule, matching what was described:
// "3 or more of the SAME item, in different sizes" -> wholesale price applies.
export function resolveUnitPrice(
  product: Product,
  quantityOfThisItem: number,
  customerTier: PriceTier
): number {
  if (customerTier === "reseller") return product.pricing.reseller;
  if (quantityOfThisItem >= 3) return product.pricing.wholesale;
  return product.pricing.retail;
}
