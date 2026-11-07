import type { Metadata } from "next";
import CareersSettings from "@/src/components/hiring/CareersSettings";
export const metadata: Metadata = { title: "Careers page | JobHub", robots: { index: false, follow: false } };
export default function Page() { return <CareersSettings/>; }
