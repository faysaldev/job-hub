import type { Metadata } from "next";
import AdminPlanManager from "@/src/components/billing/AdminPlanManager";
export const metadata: Metadata = { title: "Plan management | JobHub", robots: { index: false, follow: false } };
export default function AdminPlansPage() { return <AdminPlanManager />; }
