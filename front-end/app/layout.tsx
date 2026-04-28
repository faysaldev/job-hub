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
    default: "JobHub — Find Your Dream Job",
    template: "%s | JobHub",
  },
  description:
    "JobHub is a modern recruitment platform connecting top talent with leading companies. Browse thousands of jobs, apply in one click, and get hired faster.",
  keywords: [
    "jobs",
    "careers",
    "recruitment",
    "job search",
    "hire talent",
    "job board",
    "job listings",
    "remote jobs",
    "full-time jobs",
    "internships",
  ],
  authors: [{ name: "JobHub Team" }],
  creator: "JobHub",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://jobhub.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "JobHub",
    title: "JobHub — Find Your Dream Job",
    description:
      "Connect with top employers. Browse thousands of jobs and apply with one click.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JobHub — Find Your Dream Job",
    description:
      "Connect with top employers. Browse thousands of jobs and apply with one click.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
