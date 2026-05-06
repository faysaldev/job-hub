import PrivacyPolicyPage from "@/src/Page/PrivacyPolicy/PrivacyPolicyPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | JobHub",
  description:
    "Read the JobHub Privacy Policy to learn how we collect, use, disclose, and safeguard your personal data on our recruitment platform.",
  keywords: [
    "privacy policy",
    "data protection",
    "user privacy",
    "JobHub privacy",
    "GDPR",
    "CCPA",
  ],
};

export default function Page() {
  return <PrivacyPolicyPage />;
}

