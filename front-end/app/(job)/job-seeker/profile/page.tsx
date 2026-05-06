import SeekerProfilePage from "@/src/Page/JobSeeker/ProfilePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Professional Profile | JobHub",
  description:
    "Build and update your professional profile. Highlight your skills, experience, and projects to attract top employers on JobHub.",
  keywords: [
    "job seeker profile",
    "professional portfolio",
    "resume",
    "career profile",
    "JobHub",
  ],
};

export default function Page() {
  return <SeekerProfilePage />;
}
