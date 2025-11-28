"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { toast } from "@/src/hooks/use-toast";
import OTPVerification from "@/src/components/auth/OTPVerification";
import ResetPassword from "@/src/components/auth/ResetPassword";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: email input, 2: OTP verification, 3: reset password
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const router = useRouter();

  // Handle countdown timer
  useState(() => {
    if (step !== 2 || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  });

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    // Simulate API call to send OTP
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    setStep(2);
    setTimeLeft(60);
    toast({
      title: "OTP Sent",
      description: `An OTP has been sent to ${email}. Please check your inbox.`,
    });
  };

  const handleVerifyOtp = async (otp: string) => {
    setLoading(true);
    // Simulate OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);

    // In a real app, you would verify the OTP with the server
    // For demo purpose, let's just move to next step
    setStep(3);
    toast({
      title: "OTP Verified",
      description: "OTP verified successfully. Please enter your new password.",
    });
  };

  const handleResetPassword = async (password: string) => {
    setLoading(true);
    // Simulate password reset API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);

    toast({
      title: "Success",
      description: "Password has been reset successfully.",
    });

    // Redirect to login page
    router.push("/auth");
  };

  const handleResendOtp = async () => {
    // Simulate API call to resend OTP
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTimeLeft(60);
    toast({
      title: "OTP Sent",
      description: `A new OTP has been sent to ${email}.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E3E3E3]">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-2xl p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
              {step === 1 ? (
                <Mail className="h-10 w-10 text-white" />
              ) : (
                <Lock className="h-10 w-10 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2 text-[#234C6A]">
              {step === 1 ? "Forgot Password?" : step === 2 ? "Enter OTP" : "Reset Password"}
            </h1>
            <p className="text-[#234C6A]">
              {step === 1
                ? "No worries, we'll send you reset instructions"
                : step === 2
                ? `Enter the 6-digit code sent to ${email}`
                : "Create your new password"}
            </p>
          </div>

          <Card className="p-8 bg-white border-[#456882]/30">
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email" className="text-[#234C6A]">
                    Email Address
                  </Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-[#234C6A]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            )}

            {step === 2 && (
              <OTPVerification
                email={email}
                onVerify={handleVerifyOtp}
                onResend={handleResendOtp}
                loading={loading}
                timeLeft={timeLeft}
              />
            )}

            {step === 3 && (
              <ResetPassword
                onSubmit={handleResetPassword}
                loading={loading}
              />
            )}

            <div className="mt-6 text-center">
              <Button
                variant="outline"
                className="text-[#234C6A] border-[#234C6A]/30 hover:bg-[#234C6A]/10"
                onClick={() => {
                  if (step > 1) {
                    setStep(step - 1);
                  } else {
                    router.push("/auth");
                  }
                }}
              >
                {step > 1 ? "Back" : "Back to Login"}
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;