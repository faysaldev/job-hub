import type { MetadataRoute } from "next";
/** High-confidence public routes only. Dynamic listings need their own review before indexing. */
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const paths = ["/", "/job", "/companies", "/candidates", "/about", "/contact"];
  return paths.map((path): MetadataRoute.Sitemap[number] => ({
    url: new URL(path, origin).toString(),
    changeFrequency: path === "/job" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
