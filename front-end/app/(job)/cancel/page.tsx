import AppliedCancelPage from "@/src/Page/Jobs/AppliedCancelPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Status | JobHub",
  description:
    "Information regarding your job application payment details. Although payment was cancelled, your standard application has been successfully submitted.",
};

export default function AppliedCancel() {
  return <AppliedCancelPage />;
}
