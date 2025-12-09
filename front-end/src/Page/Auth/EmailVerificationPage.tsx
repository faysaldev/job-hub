"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";

const EmailVerificationPage = () => {
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  // Handle countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Simulate email verification check
  useEffect(() => {
    // In a real application, you would check the verification status with an API call
    // This is just for demonstration purposes
    if (isVerified) {
      const timer = setTimeout(() => {
        router.push("/auth");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVerified, router]);

  const handleResendEmail = async () => {
    setIsResending(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsResending(false);
    setTimeLeft(60); // Reset timer
  };

  const handleVerify = () => {
    // In a real application, you would validate the verification token
    setIsVerified(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E3E3E3]">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-2xl p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-[#234C6A]">
              Verify Your Email
            </h1>
            <p className="text-[#234C6A]">
              We{`'`}ve sent a verification link to{" "}
              <span className="font-semibold">{email}</span>
            </p>
          </div>

          <Card className="p-8 bg-white border-[#456882]/30">
            {isVerified ? (
              <div className="text-center py-8">
                <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-[#234C6A]">
                  Email Verified!
                </h2>
                <p className="text-[#234C6A] mb-6">
                  Your email has been successfully verified.
                </p>
                <p className="text-[#234C6A] text-sm">
                  Redirecting to login page...
                </p>
              </div>
            ) : (
              <>
                <p className="text-center text-[#234C6A] mb-6">
                  Please check your inbox and click the verification link to
                  activate your account.
                </p>

                <div className="text-center mb-6">
                  <p className="text-[#234C6A] mb-2">
                    Didn{`'`}t receive the email?
                  </p>
                  <Button
                    onClick={handleResendEmail}
                    disabled={isResending || timeLeft > 0}
                    className={`${
                      timeLeft > 0
                        ? "bg-[#234C6A]/50 text-[#234C6A] cursor-not-allowed"
                        : "bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90"
                    } text-white`}
                  >
                    {isResending
                      ? "Sending..."
                      : timeLeft > 0
                      ? `Resend in ${timeLeft}s`
                      : "Resend Verification Email"}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10"
                    onClick={() => router.push("/auth")}
                  >
                    Back to Login
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
                    onClick={handleVerify}
                  >
                    I{`'`}ve Verified My Email
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EmailVerificationPage;
