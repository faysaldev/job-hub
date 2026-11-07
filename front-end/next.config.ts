import type { NextConfig } from "next";
import path from "path";

const mediaUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL;
const mediaHost = mediaUrl?.startsWith("https://") ? new URL(mediaUrl).hostname : null;
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Keep reading old Cloudinary URLs until an explicitly verified migration is complete.
      { protocol: "https", hostname: "res.cloudinary.com" },
      ...(mediaHost ? [{ protocol: "https" as const, hostname: mediaHost }] : []),
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
