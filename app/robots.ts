import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/checkout/",
          "/checkout/verify/",
          "/account/",
          "/auth/",
          "/cart/",
          "/file-view/",
          "/maintenance/",
          "/_next/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/checkout/",
          "/checkout/verify/",
          "/account/",
          "/auth/",
          "/cart/",
          "/file-view/",
          "/maintenance/",
        ],
      },
    ],
    sitemap: "https://www.alshariyaa.com/sitemap.xml",
    host: "https://www.alshariyaa.com",
  };
}
