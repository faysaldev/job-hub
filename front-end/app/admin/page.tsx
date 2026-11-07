import type { Metadata } from "next";
import AdminOperationsCenter from "@/src/components/admin/AdminOperationsCenter";
export const metadata: Metadata = { title: "Platform operations | JobHub", robots: { index: false, follow: false } };
export default function AdminHomePage() { return <AdminOperationsCenter />; }
