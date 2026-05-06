import AuthPage from "@/src/Page/Auth/AuthPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentications | Sign In & Sign Up - JobHub",
  description:
    "Join JobHub to find your dream job or the perfect candidate. Sign in to your account or create a new one to get started.",
  keywords: [
    "job search",
    "recruitment",
    "career",
    "hiring",
    "sign in",
    "sign up",
    "JobHub",
  ],
};

export default function Auth() {
  return <AuthPage />;
}
