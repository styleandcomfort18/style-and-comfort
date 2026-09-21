import { CATEGORY_LABELS } from "@/lib/seed-products";
import { getProductsByCategory } from "@/lib/data";
import { notFound } from "next/navigation";
import CategoryClient from "./CategoryClient";

// Always fetch fresh — see note in app/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const label = CATEGORY_LABELS[params.slug];
  if (!label) return notFound();

  let products: any[] = [];
  try {
    products = await getProductsByCategory(params.slug);
  } catch {
    // Table may be empty or not seeded yet.
  }

  return <CategoryClient slug={params.slug} label={label} products={products} />;
}
