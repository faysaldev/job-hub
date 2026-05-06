import SavedJobsPage from "@/src/Page/Jobs/SavedJobsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Saved Jobs | JobHub",
  description:
    "Access and manage your bookmarked job opportunities. Keep track of the positions you're interested in and never miss an application deadline on JobHub.",
  keywords: [
    "saved jobs",
    "bookmarked jobs",
    "job search tracker",
    "JobHub",
    "career management",
  ],
};

export default function Page() {
  return <SavedJobsPage />;
}