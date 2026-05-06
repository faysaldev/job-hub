import ForgotPasswordPage from "@/src/Page/Auth/ForgotPasswordPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Passwords | JobHub",
  description:
    "Securely reset your JobHub account password. Follow the steps to verify your identity and create a new, strong password to get back to your career journey.",
  keywords: [
    "reset password",
    "recover account",
    "secure login",
    "JobHub",
    "account security",
  ],
};

export default function Page() {
  return <ForgotPasswordPage />;
}