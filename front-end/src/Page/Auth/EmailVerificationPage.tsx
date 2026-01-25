"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  Mail,
  CheckCircle,
  Clock,
  ArrowLeft,
  Sparkles,
  MailOpen,
  PartyPopper,
  ArrowRight,
  Briefcase,
  Shield,
} from "lucide-react";
import gsap from "gsap";

const EmailVerificationPage = () => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".verify-card",
        { opacity: 0, y: 40, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(
        ".email-icon",
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.3, ease: "back.out(1.7)" }
      );

      gsap.fromTo(
        ".pulse-ring",
        { scale: 1, opacity: 0.5 },
        {
          scale: 1.5,
          opacity: 0,
          duration: 2,
          repeat: -1,
          ease: "power1.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Success animation when verified
  useEffect(() => {
    if (isVerified) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".success-icon",
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" }
        );

        gsap.fromTo(
          ".confetti",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.3 }
        );
      }, containerRef);

      const timer = setTimeout(() => {
        router.push("/auth");
      }, 4000);

      return () => {
        ctx.revert();
        clearTimeout(timer);
      };
    }
  }, [isVerified, router]);

  // Handle countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResendEmail = async () => {
    setIsResending(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsResending(false);
    setTimeLeft(60);
  };

  const handleVerify = () => {
    setIsVerified(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
              Almost There!
              <span className="block text-white/80">Verify Your Email</span>
            </h1>

            <p className="text-lg text-white/70 leading-relaxed max-w-md">
              We have sent a verification link to your email. Click the link to activate your account and start your job search journey.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {[
              { step: "1", text: "Check your email inbox", done: false },
              { step: "2", text: "Click the verification link", done: false },
              { step: "3", text: "Start using JobHub", done: false },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                  {item.step}
                </div>
                <span className="text-white font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Verification */}
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
            Back
          </Link>
        </div>

        {/* Content */}
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

            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                {/* Pulse ring animation */}
                {!isVerified && (
                  <div className="pulse-ring absolute inset-0 bg-[#234C6A]/20 rounded-2xl" />
                )}
                <div className={`email-icon bg-gradient-to-br ${isVerified ? "from-green-500 to-emerald-500" : "from-[#234C6A] to-[#456882]"} rounded-2xl p-5 w-24 h-24 flex items-center justify-center shadow-lg relative z-10`}>
                  {isVerified ? (
                    <CheckCircle className="success-icon h-12 w-12 text-white" />
                  ) : (
                    <MailOpen className="h-12 w-12 text-white" />
                  )}
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-3 text-[#234C6A]">
                {isVerified ? "Email Verified!" : "Check Your Email"}
              </h1>
              <p className="text-[#456882]">
                {isVerified
                  ? "Your email has been successfully verified"
                  : (
                    <>
                      We have sent a verification link to
                      <br />
                      <span className="font-semibold text-[#234C6A]">{email}</span>
                    </>
                  )}
              </p>
            </div>

            {/* Card */}
            <Card className="verify-card p-8 bg-white border-none shadow-2xl rounded-2xl">
              {isVerified ? (
                <div className="text-center py-6">
                  {/* Confetti icons */}
                  <div className="flex justify-center gap-4 mb-8">
                    {[PartyPopper, Sparkles, PartyPopper].map((Icon, i) => (
                      <div key={i} className="confetti text-[#234C6A]">
                        <Icon className="h-8 w-8" style={{ transform: i === 1 ? "none" : `rotate(${i === 0 ? "-15deg" : "15deg"})` }} />
                      </div>
                    ))}
                  </div>

                  <h2 className="text-2xl font-bold mb-3 text-[#234C6A]">
                    Welcome to JobHub!
                  </h2>
                  <p className="text-[#456882] mb-8">
                    Your account is now active. You can start exploring jobs and building your profile.
                  </p>

                  <div className="space-y-3">
                    <Button
                      onClick={() => router.push("/auth")}
                      className="w-full h-12 bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white rounded-xl font-semibold group"
                    >
                      Continue to Sign In
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <p className="text-sm text-[#456882]">
                      Redirecting automatically in a few seconds...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Instructions */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-4 p-4 bg-[#E3E3E3]/50 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-[#234C6A] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#234C6A]">Open your email</h4>
                        <p className="text-sm text-[#456882]">Check your inbox for an email from JobHub</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-[#E3E3E3]/50 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-[#234C6A] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#234C6A]">Click the verification link</h4>
                        <p className="text-sm text-[#456882]">The link will verify your email instantly</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-[#E3E3E3]/50 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-[#234C6A] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#234C6A]">Start using JobHub</h4>
                        <p className="text-sm text-[#456882]">Begin your job search journey</p>
                      </div>
                    </div>
                  </div>

                  {/* Resend Section */}
                  <div className="text-center mb-6">
                    <p className="text-[#456882] mb-4">Did not receive the email?</p>

                    {timeLeft > 0 ? (
                      <div className="flex items-center justify-center gap-2 text-[#456882]">
                        <Clock className="h-4 w-4" />
                        <span>Resend available in {formatTime(timeLeft)}</span>
                      </div>
                    ) : (
                      <Button
                        onClick={handleResendEmail}
                        disabled={isResending}
                        className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white rounded-xl"
                      >
                        {isResending ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Resend Verification Email
                          </span>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-6 border-t border-[#E3E3E3]">
                    <Button
                      variant="outline"
                      className="border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/10"
                      onClick={() => router.push("/auth")}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
                      onClick={handleVerify}
                    >
                      I have Verified
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </>
              )}
            </Card>

            {/* Help text */}
            {!isVerified && (
              <div className="mt-6 text-center">
                <p className="text-sm text-[#456882]">
                  Check your spam folder if you do not see the email.{" "}
                  <Link href="/contact" className="text-[#234C6A] font-semibold hover:underline">
                    Contact support
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
