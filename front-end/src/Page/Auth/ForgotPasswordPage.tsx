"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Mail,
  Lock,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Briefcase,
} from "lucide-react";
import { toast } from "@/src/hooks/use-toast";
import OTPVerification from "@/src/components/auth/OTPVerification";
import ResetPassword from "@/src/components/auth/ResetPassword";
import gsap from "gsap";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".forgot-card",
        { opacity: 0, y: 40, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(
        ".step-indicator",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: "power2.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Handle countdown timer
  useEffect(() => {
    if (step !== 2 || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timeLeft]);

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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setStep(3);
    toast({
      title: "OTP Verified",
      description: "OTP verified successfully. Please enter your new password.",
    });
  };

  const handleResetPassword = async (password: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);

    toast({
      title: "Success",
      description: "Password has been reset successfully.",
    });

    router.push("/auth");
  };

  const handleResendOtp = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTimeLeft(60);
    toast({
      title: "OTP Sent",
      description: `A new OTP has been sent to ${email}.`,
    });
  };

  const steps = [
    { number: 1, title: "Email", icon: <Mail className="h-4 w-4" /> },
    { number: 2, title: "Verify", icon: <KeyRound className="h-4 w-4" /> },
    { number: 3, title: "Reset", icon: <Lock className="h-4 w-4" /> },
  ];

  const getStepIcon = () => {
    switch (step) {
      case 1:
        return <Mail className="h-12 w-12 text-white" />;
      case 2:
        return <KeyRound className="h-12 w-12 text-white" />;
      case 3:
        return <Lock className="h-12 w-12 text-white" />;
      default:
        return <Mail className="h-12 w-12 text-white" />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Forgot Password?";
      case 2:
        return "Enter Verification Code";
      case 3:
        return "Create New Password";
      default:
        return "Forgot Password?";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1:
        return "No worries! Enter your email and we will send you a reset code.";
      case 2:
        return `Enter the 6-digit code sent to ${email}`;
      case 3:
        return "Create a strong password for your account.";
      default:
        return "";
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen flex bg-[#E3E3E3]">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/20">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">JobHub</span>
          </Link>

          <div className="mb-12">
            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              Secure Password
              <span className="block text-white/80">Recovery</span>
            </h1>

            <p className="text-lg text-white/70 leading-relaxed max-w-md">
              We take security seriously. Our password recovery process is designed to keep your account safe.
            </p>
          </div>

          {/* Security features */}
          <div className="space-y-4">
            {[
              { icon: ShieldCheck, text: "Enterprise-grade encryption" },
              { icon: KeyRound, text: "Secure verification codes" },
              { icon: Lock, text: "Strong password requirements" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10"
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-white font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-xl p-2">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-[#234C6A]">JobHub</span>
          </Link>
          <Link
            href="/auth"
            className="flex items-center gap-2 text-[#456882] hover:text-[#234C6A] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Desktop Back Link */}
            <div className="hidden lg:block mb-8">
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 text-[#456882] hover:text-[#234C6A] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>

            {/* Step Indicator */}
            <div className="step-indicator flex items-center justify-center gap-2 mb-8">
              {steps.map((s, i) => (
                <div key={s.number} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      step >= s.number
                        ? "bg-gradient-to-r from-[#234C6A] to-[#456882] text-white"
                        : "bg-white text-[#456882]"
                    }`}
                  >
                    {step > s.number ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      s.icon
                    )}
                    <span className="text-sm font-medium hidden sm:inline">{s.title}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`w-8 h-0.5 mx-1 transition-colors duration-300 ${
                        step > s.number ? "bg-[#234C6A]" : "bg-[#E3E3E3]"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-2xl p-5 w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                {getStepIcon()}
              </div>
              <h1 className="text-3xl font-bold mb-3 text-[#234C6A]">
                {getStepTitle()}
              </h1>
              <p className="text-[#456882]">{getStepDescription()}</p>
            </div>

            {/* Card */}
            <Card className="forgot-card p-8 bg-white border-none shadow-2xl rounded-2xl">
              {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email" className="text-[#234C6A] font-semibold">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 border-[#234C6A]/20 focus:border-[#234C6A] focus:ring-[#234C6A] rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white rounded-xl font-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending Code...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Send Verification Code
                        <Sparkles className="h-4 w-4" />
                      </span>
                    )}
                  </Button>

                  {/* Security notice */}
                  <div className="flex items-start gap-3 p-4 bg-[#E3E3E3]/50 rounded-xl">
                    <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#456882]">
                      For your security, we will send a 6-digit verification code to your email.
                    </p>
                  </div>
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
                <ResetPassword onSubmit={handleResetPassword} loading={loading} />
              )}

              {/* Back button */}
              <div className="mt-6 pt-6 border-t border-[#E3E3E3]">
                <Button
                  variant="ghost"
                  className="w-full text-[#234C6A] hover:bg-[#234C6A]/10 font-medium"
                  onClick={() => {
                    if (step > 1) {
                      setStep(step - 1);
                    } else {
                      router.push("/auth");
                    }
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {step > 1 ? "Go Back" : "Back to Sign In"}
                </Button>
              </div>
            </Card>

            {/* Help text */}
            <p className="text-center text-sm text-[#456882] mt-6">
              Remember your password?{" "}
              <Link href="/auth" className="text-[#234C6A] font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
