import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/src/Provider/ReduxProvider";
import SocketProvider from "@/src/Provider/SocketProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "JobHub",
  title: { default: "JobHub | Find jobs and hire talent", template: "%s | JobHub" },
  description: "Browse available jobs, follow your applications and manage recruitment in JobHub.",
  openGraph: { type: "website", siteName: "JobHub", title: "JobHub | Find jobs and hire talent", description: "One platform for finding work and managing recruitment.", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  category: "jobs",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={inter.variable}><body className="antialiased"><ReduxProvider><SocketProvider><Toaster position="top-right" richColors closeButton />{children}</SocketProvider></ReduxProvider></body></html>;
}
