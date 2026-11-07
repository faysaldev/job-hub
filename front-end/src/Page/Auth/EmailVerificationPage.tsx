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
  AlertCircle,
} from "lucide-react";
import gsap from "gsap";

import {
  useVerifyEmailMutation,
  useResendVerificationMutation,
} from "@/src/redux/features/auth/authApi";
import { useAppDispatch } from "@/src/redux/hooks";
import { setUser } from "@/src/redux/features/auth/authSlice";
import { toast } from "sonner";

const EmailVerificationPage = () => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] =
    useResendVerificationMutation();

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-verify if code and email are present in URL
  useEffect(() => {
    if (code && email && !isVerified) {
      handleVerify(code, email);
    }
  }, [code, email]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".verify-card",
        { opacity: 0, y: 40, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
      );

      gsap.fromTo(
        ".email-icon",
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: 0.3,
          ease: "back.out(1.7)",
        },
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
        },
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
          { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" },
        );

        gsap.fromTo(
          ".confetti",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.3 },
        );
      }, containerRef);

      return () => {
        ctx.revert();
      };
    }
  }, [isVerified]);

  // Handle countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResendEmail = async () => {
    try {
      await resendVerification({ email }).unwrap();
      toast.success("Verification email resent!");
      setTimeLeft(60);
      setError(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend email");
    }
  };

  const handleVerify = async (vCode?: string, vEmail?: string) => {
    const targetCode = vCode || code;
    const targetEmail = vEmail || email;

    if (!targetCode || !targetEmail) {
      toast.error("Missing verification information");
      return;
    }

    try {
      setError(null);
      const result = await verifyEmail({
        email: targetEmail,
        code: Number(targetCode),
      }).unwrap();

      if (result?.data?.accessToken && result?.data?.user) {
        dispatch(
          setUser({
            user: result.data.user,
            token: result.data.accessToken,
          }),
        );

        setIsVerified(true);
        toast.success("Email verified successfully!");

        // Auto-redirect based on role after a delay
        setTimeout(() => {
          const role = result.data.user.role;
          router.push(role === "recruiter" ? "/recruiter" : "/job-seeker");
        }, 3000);
      }
    } catch (err: any) {
      const errorMsg = err?.data?.message || "Verification failed. Code may be expired or invalid.";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
            Account Activation · Identity Verification
          </p>
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            Almost There!
            <span className="block text-neutral-400">Verify Your Email</span>
          </h1>

          <p className="text-sm text-neutral-400 leading-relaxed">
            We have sent a verification code to your email. Confirm your account to immediately begin exploring roles and connecting with recruiters.
          </p>

          {/* Steps */}
          <div className="mt-8 space-y-3.5">
            {[
              { step: "1", text: "Check your inbox for a message from JOB ! HUB" },
              { step: "2", text: "Enter your 6-digit confirmation code" },
              { step: "3", text: "Access your dashboard and start applying" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl"
              >
                <div className="w-8 h-8 rounded-lg bg-black border border-neutral-800 flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {item.step}
                </div>
                <span className="text-xs font-medium text-neutral-200">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-neutral-500">© {new Date().getFullYear()} JOB ! HUB · All rights reserved.</p>
      </div>

      {/* Right Side - Verification */}
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

        {/* Content */}
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

            {/* Header */}
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <div
                  className={`email-icon ${
                    isVerified
                      ? "bg-emerald-600 text-white"
                      : error
                      ? "bg-rose-600 text-white"
                      : "bg-black text-white"
                  } rounded-2xl p-4 w-16 h-16 flex items-center justify-center shadow-xs relative z-10`}
                >
                  {isVerified ? (
                    <CheckCircle className="success-icon h-8 w-8 text-white" />
                  ) : error ? (
                    <AlertCircle className="h-8 w-8 text-white" />
                  ) : (
                    <MailOpen className="h-8 w-8 text-white" />
                  )}
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827] mb-1.5">
                {isVerified ? "Email Verified!" : error ? "Verification Failed" : "Check Your Email"}
              </h1>
              <p className="text-xs text-[#596d7e] leading-relaxed max-w-sm mx-auto">
                {isVerified ? (
                  "Your email has been successfully verified."
                ) : error ? (
                  error
                ) : (
                  <>
                    We have sent a verification code to{" "}
                    <strong className="font-semibold text-black">{email}</strong>.
                  </>
                )}
              </p>
            </div>

            {/* Card */}
            <Card className="verify-card p-6 sm:p-8 border border-[#eaecf0] bg-white shadow-xs rounded-2xl relative overflow-hidden">
              {isVerified ? (
                <div className="text-center py-4">
                  <div className="flex justify-center gap-3 mb-4">
                    {[PartyPopper, Sparkles, PartyPopper].map((Icon, i) => (
                      <div key={i} className="confetti text-black">
                        <Icon className="h-6 w-6" />
                      </div>
                    ))}
                  </div>

                  <h2 className="text-xl font-bold mb-1.5 text-[#111827]">
                    Welcome to JOB ! HUB
                  </h2>
                  <p className="text-xs text-[#596d7e] mb-6">
                    Your profile is active and verified. Redirecting you to your portal...
                  </p>

                  <Button
                    onClick={() => {
                      router.push("/job-seeker");
                    }}
                    className="w-full h-11 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs transition-all cursor-pointer"
                  >
                    Go to Portal
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : isVerifying ? (
                <div className="text-center py-8">
                  <div className="w-10 h-10 border-3 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h3 className="text-base font-bold text-[#111827]">Verifying your email...</h3>
                  <p className="text-xs text-[#596d7e] mt-1">Please wait while we confirm your credentials.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Instructions */}
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-[#eaecf0]">
                      <div className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#111827]">
                          Open your inbox
                        </h4>
                        <p className="text-[11.5px] text-[#596d7e]">
                          Check your email for the verification link or code
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-[#eaecf0]">
                      <div className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#111827]">
                          Activate your account
                        </h4>
                        <p className="text-[11.5px] text-[#596d7e]">
                          Confirm your email to complete your registration
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Resend Section */}
                  <div className="text-center pt-1">
                    <p className="text-xs text-[#596d7e] mb-2.5">
                      Didn&apos;t receive the email?
                    </p>

                    {timeLeft > 0 ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-lg text-xs font-medium text-neutral-600">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Resend available in <strong className="text-black">{formatTime(timeLeft)}</strong></span>
                      </div>
                    ) : (
                      <Button
                        onClick={handleResendEmail}
                        disabled={isResending}
                        className="bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider h-10 px-5 shadow-2xs transition-all cursor-pointer"
                      >
                        {isResending ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />
                            Resend Email
                          </span>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className={`grid ${code ? "grid-cols-2" : "grid-cols-1"} gap-2.5 pt-4 border-t border-neutral-100`}>
                    <Button
                      variant="outline"
                      className="border-[#eaecf0] text-neutral-700 hover:bg-neutral-50 h-10 rounded-xl text-xs font-semibold"
                      onClick={() => router.push("/auth")}
                    >
                      <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                      Back to Sign In
                    </Button>

                    {code && (
                      <Button
                        className="bg-black hover:bg-neutral-800 text-white h-10 rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs cursor-pointer"
                        onClick={() => handleVerify()}
                        disabled={isVerifying}
                      >
                        {isVerifying ? (
                          "Verifying..."
                        ) : (
                          <>
                            Verify Code
                            <CheckCircle className="h-3.5 w-3.5 ml-1.5" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>

            {/* Help text */}
            {!isVerified && (
              <div className="mt-5 text-center">
                <p className="text-xs text-[#596d7e]">
                  Check your spam folder if you don&apos;t see the message.{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-black hover:underline"
                  >
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
