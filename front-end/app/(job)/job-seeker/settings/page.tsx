import type { Metadata } from "next";
import AccountSettingsPage from "@/src/components/auth/AccountSettingsPage";
export const metadata: Metadata = { title: "Account settings", robots: { index: false, follow: false } };
export default function Page() { return <AccountSettingsPage role="seeker" />; }
