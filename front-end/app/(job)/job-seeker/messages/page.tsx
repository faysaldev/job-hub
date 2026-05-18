import { Suspense } from "react";
import SeekerMessagesPage from "@/src/Page/JobSeeker/MessagesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages | JobHub",
  description:
    "Communicate directly with employers and recruiters. Manage your conversations and stay connected during your job search.",
  keywords: ["messages", "employer communication", "job search chat", "JobHub"],
};

export default function Page() {
  return (
    <Suspense>
      <SeekerMessagesPage />
    </Suspense>
  );
}
