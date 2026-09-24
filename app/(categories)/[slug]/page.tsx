import type { Metadata } from "next";
import { slugConfigs } from "../../lib/categoryConfig";
import { sortProducts } from "../../lib/sortProducts";
import type { Product } from "../../components/products/types";
import CategoryPageClient from "./CategoryPageClient";

const SITE_URL = "https://basmathatify.com";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "لمسه لبيع الشرائح";
const BACKEND = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function filterProducts(products: Product[], slug: string): Product[] {
  const config = slugConfigs[slug];
  if (!config) return products;
  const { brand, category, nameIncludes, nameExcludes } = config.filters;
  return products.filter((p) => {
    const matchBrand = brand ? p.brand?.toLowerCase() === brand.toLowerCase() : true;
    const matchCategory = category ? p.category === category : true;
    const matchName = nameIncludes?.length
      ? nameIncludes.some((kw) => p.name?.toLowerCase().includes(kw.toLowerCase()))
      : true;
    const matchExclude = nameExcludes?.length
      ? !nameExcludes.some((kw) => p.name?.toLowerCase().includes(kw.toLowerCase()))
      : true;
    return matchBrand && matchCategory && matchName && matchExclude;
  });
}

async function getCategoryProducts(slug: string): Promise<Product[]> {
  try {
    const config = slugConfigs[slug];
    const brand = config?.filters?.brand ?? "";
    const query = brand ? `?brand=${encodeURIComponent(brand)}&cardOnly=true` : "?cardOnly=true";
    const res = await fetch(`${BACKEND}/api/products${query}`, {
      next: { revalidate: 300, tags: ["category-products", `category-${slug}`] },
    });
    if (!res.ok) return [];
    const data: Product[] = await res.json();
    return sortProducts(filterProducts(data, slug));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const config = slugConfigs[slug];

  const label = config?.label ?? slug;
  const parentLabel = config?.parentLabel ?? "";

  const title = parentLabel
    ? `${label} - ${parentLabel} | اشتري بالتقسيط من ${SITE_NAME}`
    : `${label} | أفضل الأسعار والتقسيط المريح من ${SITE_NAME}`;
  const description = `تسوق ${label} بأفضل الأسعار وبالتقسيط المريح بدون فوائد في ${SITE_NAME}. ${parentLabel ? `ضمن قسم ${parentLabel}.` : ""} شحن سريع لجميع مناطق المملكة وضمان معتمد على جميع المنتجات.`;

  return {
    title,
    description,
    keywords: [label, parentLabel, SITE_NAME, "أقساط", "شراء", "السعودية"].filter(Boolean),
    openGraph: {
      type: "website",
      url: `${SITE_URL}/categories/${slug}`,
      title: `${title} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      locale: "ar_SA",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/categories/${slug}`,
    },
  };
}

export default async function CategorySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const initialProducts = await getCategoryProducts(slug);
  return <CategoryPageClient slug={slug} initialProducts={initialProducts} />;
}
