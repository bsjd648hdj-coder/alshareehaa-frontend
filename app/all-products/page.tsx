import { Suspense } from "react";
import AllProductsClient from "./AllProductsClient";
import type { Product } from "../components/products/types";
import { sortProducts } from "../lib/sortProducts";

export const metadata = {
  title: "جميع الشرائح والمنتجات | لمسه لبيع الشرائح",
  description: "تصفح جميع شرائح الاتصال وباقات الإنترنت بأفضل الأسعار من لمسه لبيع الشرائح",
};

interface AllProductsPageProps {
  searchParams: Promise<{ brand?: string }>;
}

async function getProductsByBrand(brand?: string): Promise<Product[]> {
  const BACKEND = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const query = brand ? `?brand=${encodeURIComponent(brand)}&cardOnly=true` : `?cardOnly=true`;
    const res = await fetch(`${BACKEND}/api/products${query}`, {
      next: { revalidate: 300, tags: ["products"] },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : [];
  } catch {
    return [];
  }
}

export default async function AllProductsPage({ searchParams }: AllProductsPageProps) {
  const { brand } = await searchParams;
  const rawProducts = await getProductsByBrand(brand);
  const products = sortProducts(rawProducts, !!brand);

  return (
    <Suspense>
      <AllProductsClient initialProducts={products} initialBrand={brand || ""} />
    </Suspense>
  );
}
