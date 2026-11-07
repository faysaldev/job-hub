import type { Metadata } from "next";
import { Suspense } from "react";
import BillingWorkspace from "@/src/components/billing/BillingWorkspace";
import { PageLoading } from "@/src/components/feedback/LoadingStates";
export const metadata: Metadata = { title: "Plans & billing | JobHub", robots: { index: false, follow: false } };
export default function BillingPage() { return <Suspense fallback={<PageLoading heading="Loading billing" cards={3}/>}><BillingWorkspace /></Suspense>; }
