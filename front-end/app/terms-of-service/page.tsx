import TermsOfServicePage from "@/src/Page/TermsOfService/TermsOfServicePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | JobHub",
  description:
    "Read the JobHub Terms of Service. Understand the rules, guidelines, and legal agreements for using our recruitment platform.",
  keywords: [
    "terms of service",
    "JobHub terms",
    "legal agreement",
    "user agreement",
    "platform rules",
  ],
};

export default function Page() {
  return <TermsOfServicePage />;
}

