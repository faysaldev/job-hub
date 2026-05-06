import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/src/Provider/ReduxProvider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "JobHub — Find Your Dream Job & Accelerate Your Career",
    template: "%s | JobHub Platform",
  },
  description:
    "JobHub is the ultimate modern recruitment platform connecting elite talent with industry-leading companies. Discover top-tier remote, hybrid, and on-site jobs, apply with a single click, and fast-track your professional growth.",
  keywords: [
    "job search engine",
    "career platform",
    "hiring platform",
    "recruitment software",
    "find jobs online",
    "remote tech jobs",
    "executive search",
    "job board",
    "career growth",
    "JobHub",
    "tech careers",
    "freelance opportunities",
    "full-time employment",
  ],
  authors: [{ name: "JobHub Team", url: "https://jobhub.com/about" }],
  creator: "JobHub Inc.",
  publisher: "JobHub Recruitment Services",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://jobhub.com"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "JobHub",
    title: "JobHub — Find Your Dream Job & Accelerate Your Career",
    description:
      "Connect with premier employers worldwide. Browse thousands of high-paying jobs, receive personalized recommendations, and apply instantly.",
    images: [
      {
        url: "/og-image.jpg", // Assuming an og-image will exist
        width: 1200,
        height: 630,
        alt: "JobHub Platform - Find your next career move",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JobHub — Find Your Dream Job",
    description:
      "Connect with premier employers worldwide. Browse thousands of high-paying jobs and apply instantly.",
    creator: "@jobhub",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Placeholder for actual GSC verification
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <ReduxProvider>
          <Toaster position="top-right" richColors closeButton />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
