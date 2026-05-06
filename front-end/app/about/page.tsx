import AboutPage from "@/src/Page/About/AboutPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | JobHub",
  description:
    "Learn about JobHub's mission to connect professionals with their dream opportunities. Discover our story, core values, and the leadership team driving our platform.",
  keywords: [
    "about JobHub",
    "company mission",
    "core values",
    "JobHub team",
    "career platform",
  ],
};

export default function Page() {
  return <AboutPage />;
}

