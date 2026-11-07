import { Suspense } from "react";
import EmailVerificationPage from "@/src/Page/Auth/EmailVerificationPage";
import { PageLoading } from "@/src/components/feedback/LoadingStates";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Verify email", robots: { index: false, follow: false } };
export default function Page() {
  return <Suspense fallback={<PageLoading heading="Verifying email" cards={1} />}><EmailVerificationPage /></Suspense>;
}
