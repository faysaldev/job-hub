import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/auth", "/verify-email", "/reset-password", "/recruiter", "/job-seeker", "/notifications", "/job/saved", "/applied-successfully", "/cancel", "/candidates/"] },
    sitemap: new URL("/sitemap.xml", origin).toString(),
  };
}
