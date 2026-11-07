import HomePage from "@/src/Page/HomePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JobHub — Find jobs and hire talent",
  description: "Search available roles, manage applications and connect with employers and candidates through JobHub.",
  alternates: { canonical: "/" },
  openGraph: { title: "JobHub — Find jobs and hire talent", description: "Explore jobs and manage recruitment in one place." },
};
export default function Home() { return <HomePage />; }
