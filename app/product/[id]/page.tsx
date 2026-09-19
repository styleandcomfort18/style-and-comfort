import { notFound } from "next/navigation";
import { getProductById } from "@/lib/data";
import ProductDetailClient from "./ProductDetailClient";

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
