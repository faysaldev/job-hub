import HomePage from "@/src/Page/HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JobHub - Find Your Dream Job",
  description:
    "JobHub connects professionals with top companies. Search and apply for jobs, get career advice, and grow your career with us.",
  keywords: [
    "job search",
    "jobs",
    "career opportunities",
    "job portal",
    "recruitment",
    "JobHub",
    "hiring",
  ],
};

export default function Home() {
  return <HomePage />;
}
