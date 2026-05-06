import MessagesPage from "@/src/Page/Recruiter/MessagesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recruiter Messages | JobHub",
  description:
    "Manage candidate messages, track conversations, and coordinate interviews through the secure JobHub messaging system.",
  keywords: [
    "recruiter messaging",
    "candidate communication",
    "interview scheduling",
    "jobhub recruiter",
    "message inbox",
  ],
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecruiterMessagesPage() {
  return <MessagesPage />;
}
