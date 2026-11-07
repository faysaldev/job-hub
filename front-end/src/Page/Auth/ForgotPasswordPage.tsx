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
} from "lucide-react";
import { toast } from "@/src/hooks/use-toast";
import ResetPassword from "@/src/components/auth/ResetPassword";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "@/src/redux/features/auth/authApi";
import { Clock, RefreshCw } from "lucide-react";
import gsap from "gsap";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [forgotPassword, { isLoading: isForgotLoading }] =
    useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetLoading }] =
    useResetPasswordMutation();

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".forgot-card",
        { opacity: 0, y: 40, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
      );

      gsap.fromTo(
        ".step-indicator",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: "power2.out" },
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

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const currentEmail = emailRef.current?.value || "";

    if (!currentEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await forgotPassword({ email: currentEmail }).unwrap();
      setEmail(currentEmail);
      setStep(2);
      setTimeLeft(60);
      toast({
        title: "OTP Sent",
        description: `An OTP has been sent to ${currentEmail}. Please check your inbox.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.error || "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleResetPassword = async (password: string) => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter the complete 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    try {
      await resetPassword({
        email,
        code,
        newPassword: password,
      }).unwrap();

      toast({
        title: "Success",
        description: "Password has been reset successfully.",
      });

      router.push("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.data?.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
    { number: 2, title: "Reset", icon: <ShieldCheck className="h-4 w-4" /> },
  ];

  const getStepIcon = () => {
    switch (step) {
      case 1:
        return <Mail className="h-7 w-7 text-white" />;
      case 2:
        return <ShieldCheck className="h-7 w-7 text-white" />;
      default:
        return <Mail className="h-7 w-7 text-white" />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Forgot Password?";
      case 2:
        return "Verify & Reset";
      default:
        return "Forgot Password?";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1:
        return "Enter your registered email address and we will send you a 6-digit recovery code.";
      case 2:
        return `Enter the code sent to ${email} and choose a strong new password.`;
      default:
        return "";
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen flex bg-[#f8fafc]">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-black border-r border-neutral-800 p-12 xl:p-16 text-white flex-col justify-between">
        <Link
          href="/"
          aria-label="JOB ! HUB home"
          className="inline-flex items-center gap-2 text-2xl font-black tracking-tighter text-white"
        >
          JOB ! HUB
        </Link>

        <div className="max-w-md my-auto">
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-neutral-400">
            Account Recovery · Security First
          </p>
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            Secure Password
            <span className="block text-neutral-400">Recovery</span>
          </h1>

          <p className="text-sm text-neutral-400 leading-relaxed">
            We prioritize your account security. Our two-step verification process ensures that only verified owners can restore access.
          </p>

          <div className="mt-8 space-y-3.5">
            {[
              { icon: ShieldCheck, text: "End-to-end credential encryption" },
              { icon: KeyRound, text: "Expiring 6-digit verification codes" },
              { icon: Lock, text: "Strong password complexity requirements" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl"
              >
                <span className="w-9 h-9 rounded-lg bg-black border border-neutral-800 flex items-center justify-center shrink-0">
                  <item.icon className="h-4 w-4 text-white" />
                </span>
                <span className="text-xs font-medium text-neutral-200">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-neutral-500">© {new Date().getFullYear()} JOB ! HUB · All rights reserved.</p>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden p-6 flex items-center justify-between">
          <Link
            href="/"
            aria-label="JOB ! HUB home"
            className="inline-flex items-center gap-1.5 text-xl font-black tracking-tighter text-black"
          >
            JOB ! HUB
          </Link>
          <Link
            href="/auth"
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign In
          </Link>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-10 lg:p-12 xl:p-16">
          <div className="w-full max-w-[480px]">
            {/* Desktop Back Link */}
            <div className="hidden lg:block mb-6">
              <Link
                href="/auth"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-black transition-colors group"
              >
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to Sign In
              </Link>
            </div>

            {/* Step Indicator */}
            <div className="step-indicator flex items-center justify-center gap-2 mb-6">
              {steps.map((s, i) => (
                <div key={s.number} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      step >= s.number
                        ? "bg-black text-white shadow-2xs"
                        : "bg-white text-neutral-500 border border-[#eaecf0]"
                    }`}
                  >
                    {step > s.number ? (
                      <CheckCircle className="h-3.5 w-3.5" />
                    ) : (
                      s.icon
                    )}
                    <span>{s.title}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`w-8 h-0.5 mx-1 transition-colors ${
                        step > s.number ? "bg-black" : "bg-neutral-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="bg-black text-white rounded-2xl p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-xs">
                {getStepIcon()}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827] mb-1.5">
                {getStepTitle()}
              </h1>
              <p className="text-xs text-[#596d7e] max-w-sm mx-auto leading-relaxed">
                {getStepDescription()}
              </p>
            </div>

            {/* Card */}
            <Card className="forgot-card p-6 sm:p-8 border border-[#eaecf0] bg-white shadow-xs rounded-2xl relative overflow-hidden">
              {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="forgot-email"
                      className="text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="name@company.com"
                        ref={emailRef}
                        className="pl-10 h-11 border-[#eaecf0] bg-white shadow-2xs focus:border-black focus:ring-1 focus:ring-black transition-all rounded-xl placeholder:text-neutral-400 text-sm text-[#111827]"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs transition-all group cursor-pointer"
                    disabled={isForgotLoading}
                  >
                    {isForgotLoading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Sending Code...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Send Verification Code
                        <Sparkles className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </Button>

                  {/* Security notice */}
                  <div className="flex items-start gap-2.5 p-3 bg-neutral-50 rounded-xl border border-[#eaecf0] text-xs text-neutral-600">
                    <ShieldCheck className="h-4 w-4 text-neutral-500 flex-shrink-0 mt-0.5" />
                    <p>
                      For your account security, a 6-digit temporary verification code will be sent to your inbox.
                    </p>
                  </div>
                </form>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  {/* OTP Section */}
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 text-center block">
                      Verification Code
                    </Label>
                    <div className="flex justify-center gap-2 sm:gap-2.5">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          ref={(el) => {
                            otpRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className={`w-10 h-12 sm:w-11 sm:h-13 text-xl font-bold text-center rounded-xl transition-all shadow-2xs ${
                            digit
                              ? "border-2 border-black bg-black/5 text-black"
                              : "border border-[#eaecf0] bg-white text-neutral-900"
                          } focus:outline-none focus:ring-1 focus:ring-black focus:border-black`}
                        />
                      ))}
                    </div>

                    <div className="flex justify-center pt-1">
                      {timeLeft > 0 ? (
                        <p className="text-xs text-neutral-500">
                          Resend in{" "}
                          <strong className="font-bold text-black">
                            {formatTime(timeLeft)}
                          </strong>
                        </p>
                      ) : (
                        <Button
                          onClick={() => handleSendOtp()}
                          disabled={isForgotLoading}
                          variant="ghost"
                          size="sm"
                          className="text-xs font-semibold text-black hover:bg-neutral-100 h-8 rounded-lg"
                        >
                          <RefreshCw
                            className={`h-3 w-3 mr-1.5 ${isForgotLoading ? "animate-spin" : ""}`}
                          />
                          Resend Code
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="pt-5 border-t border-neutral-100">
                    <ResetPassword
                      onSubmit={handleResetPassword}
                      loading={isResetLoading}
                    />
                  </div>
                </div>
              )}

              {/* Back button */}
              <div className="mt-5 pt-4 border-t border-neutral-100">
                <Button
                  variant="ghost"
                  className="w-full text-xs font-semibold text-neutral-600 hover:text-black hover:bg-neutral-50 h-10 rounded-xl"
                  onClick={() => {
                    if (step > 1) {
                      setStep(step - 1);
                    } else {
                      router.push("/auth");
                    }
                  }}
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                  {step > 1 ? "Go Back" : "Back to Sign In"}
                </Button>
              </div>
            </Card>

            {/* Help text */}
            <p className="text-center text-xs text-[#596d7e] mt-5">
              Remember your password?{" "}
              <Link
                href="/auth"
                className="font-semibold text-black hover:underline"
              >
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
