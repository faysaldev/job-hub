import HomePage from "@/src/Page/HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JobHub | Best Platform to Find Tech, Remote & Corporate Jobs",
  description:
    "Join thousands of professionals on JobHub. Discover high-paying remote, hybrid, and on-site opportunities across technology, finance, healthcare, and more. Apply seamlessly, track applications, and accelerate your career growth today.",
  keywords: [
    "job search website",
    "best job portal",
    "remote tech jobs",
    "software engineering careers",
    "marketing jobs",
    "find jobs fast",
    "apply online",
    "top employers",
    "career opportunities",
    "hiring now",
    "JobHub careers",
    "professional networking",
    "executive roles",
  ],
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <HomePage />;
}
