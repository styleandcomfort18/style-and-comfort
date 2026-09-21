import { notFound } from "next/navigation";
import { getProductById } from "@/lib/data";
import ProductDetailClient from "./ProductDetailClient";

// Always fetch fresh — see note in app/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductPage({ params }: { params: { id: string } }) {
  let product;
  try {
    product = await getProductById(params.id);
  } catch {
    return notFound();
  }
  if (!product) return notFound();

  return <ProductDetailClient product={product} />;
}
