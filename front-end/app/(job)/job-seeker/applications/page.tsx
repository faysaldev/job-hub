import SeekerApplicationsPage from "@/src/Page/JobSeeker/ApplicationsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Applications | JobHub",
  description:
    "Track the status of your submitted job applications. Stay updated on where you stand in the recruitment process.",
  keywords: [
    "job applications",
    "application tracking",
    "job search",
    "JobHub",
  ],
};

export default function Page() {
  return <SeekerApplicationsPage />;
}
