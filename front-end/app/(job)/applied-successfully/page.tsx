import AppliedSuccessfullyPage from "@/src/Page/Jobs/AppliedSuccessfullyPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Successful | JobHub",
  description:
    "Congratulations! Your job application has been submitted successfully. Your career journey continues here. Track your application status and discover more opportunities on JobHub.",
};

export default function AppliedSuccessfully() {
  return <AppliedSuccessfullyPage />;
}
