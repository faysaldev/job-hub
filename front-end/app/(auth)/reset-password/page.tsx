import { Suspense } from "react";
import ForgotPasswordPage from "@/src/Page/Auth/ForgotPasswordPage";
import { PageLoading } from "@/src/components/feedback/LoadingStates";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Reset password", robots: { index: false, follow: false } };
export default function Page() {
  return <Suspense fallback={<PageLoading heading="Reset password" cards={1} />}><ForgotPasswordPage /></Suspense>;
}
