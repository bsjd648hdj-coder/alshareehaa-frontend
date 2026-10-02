import { Suspense } from "react";
import AllProductsClient from "./AllProductsClient";
import type { Product } from "../components/products/types";
import { sortProducts } from "../lib/sortProducts";
import type { Metadata } from "next";

const SITE_URL = "https://www.alshariyaa.com";
const SITE_NAME = "الشريحة الموثوقة";

export const metadata: Metadata = {
  title: `جميع الشرائح والمنتجات | ${SITE_NAME}`,
  description:
    "تصفح جميع شرائح الاتصال وباقات الإنترنت بأفضل الأسعار من الشريحة الموثوقة. STC وموبايلي وزين وفيرجن وسلام.",
  alternates: {
    canonical: `${SITE_URL}/all-products`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/all-products`,
    title: `جميع الشرائح والمنتجات | ${SITE_NAME}`,
    description:
      "تصفح جميع شرائح الاتصال وباقات الإنترنت بأفضل الأسعار من الشريحة الموثوقة.",
    siteName: SITE_NAME,
    locale: "ar_SA",
  },
};

interface AllProductsPageProps {
  searchParams: Promise<{ brand?: string }>;
}

async function getProductsByBrand(brand?: string): Promise<Product[]> {
  const BACKEND =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";
  try {
    const query = brand
      ? `?brand=${encodeURIComponent(brand)}&cardOnly=true`
      : `?cardOnly=true`;
    const res = await fetch(`${BACKEND}/api/products${query}`, {
      next: { revalidate: 300, tags: ["products"] },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data)
      ? data
      : Array.isArray(data?.products)
      ? data.products
      : [];
  } catch {
    return [];
  }
}

export default async function AllProductsPage({
  searchParams,
}: AllProductsPageProps) {
  const { brand } = await searchParams;
  const rawProducts = await getProductsByBrand(brand);
  const products = sortProducts(rawProducts, !!brand);

  return (
    <Suspense>
      <AllProductsClient initialProducts={products} initialBrand={brand || ""} />
    </Suspense>
  );
}
