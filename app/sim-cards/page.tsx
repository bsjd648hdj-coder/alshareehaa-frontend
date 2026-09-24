import SimCardsClient from "./SimCardsClient";
import type { Product } from "../components/products/types";
import { sortProducts } from "../lib/sortProducts";

export const metadata = {
  title: "شرائح الاتصال | لمسه لبيع الشرائح",
  description: "اختر شريحتك المناسبة من جميع شركات الاتصالات السعودية من لمسه لبيع الشرائح وتمتع باتصال سريع وتغطية قوية في كل مكان",
};

const BACKEND = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getSimCards(): Promise<Product[]> {
  try {
    const res = await fetch(`${BACKEND}/api/products?category=sim-cards&cardOnly=true`, {
      next: { revalidate: 300, tags: ["sim-cards"] },
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const raw = Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : [];
    return sortProducts(raw);
  } catch {
    return [];
  }
}

export default async function SimCardsPage() {
  const products = await getSimCards();
  return <SimCardsClient initialProducts={products} />;
}
