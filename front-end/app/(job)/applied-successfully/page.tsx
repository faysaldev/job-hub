"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Calendar,
  ShieldCheck,
  Package,
  ReceiptText,
  CreditCard,
  Briefcase,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { useGetPaymentDetailsQuery } from "@/src/redux/features/stripe/stripeApi";
import gsap from "gsap";
import Link from "next/link";

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const applicationId = searchParams.get("application_id");
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data: paymentResponse,
    isLoading,
    isError,
  } = useGetPaymentDetailsQuery(sessionId || "", {
    skip: !sessionId,
  });

  const paymentData = paymentResponse?.data;

  useEffect(() => {
    if (!isLoading) {
      const ctx = gsap.context(() => {
        gsap.from(".animate-in", {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        });

        gsap.from(".success-icon", {
          scale: 0,
          rotate: -180,
          duration: 1,
          ease: "back.out(1.7)",
          delay: 0.2,
        });

        gsap.to(".sparkle", {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(2)",
          delay: 0.8,
        });
      }, containerRef);

      return () => ctx.revert();
    }
  }, [isLoading]);

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6 rounded-[32px] shadow-2xl border-none">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-[#234C6A]">
            Invalid Session
          </h1>
          <p className="text-gray-500 font-medium">
            We couldn't find your payment session. Please check your email or
            contact support.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="w-full h-12 rounded-xl bg-[#234C6A] text-white font-bold"
          >
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-[#234C6A] border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-black text-[#234C6A] animate-pulse">
          Verifying Payment...
        </h2>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">
          Connecting to Stripe Securely
        </p>
      </div>
    );
  }

  const isSuccess = paymentData?.completed;

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F8FAFC] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-5 gap-10 items-start">
          {/* Main Success Card */}
          <div className="md:col-span-3 space-y-8">
            <Card className="animate-in border-none shadow-2xl shadow-blue-900/5 rounded-[48px] p-10 bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full -mr-32 -mt-32 opacity-50" />

              <div className="relative z-10 text-center space-y-8">
                <div className="relative inline-block">
                  <div className="success-icon w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[32px] flex items-center justify-center shadow-xl shadow-emerald-500/20 mx-auto">
                    <CheckCircle2 className="h-12 w-12 text-white" />
                  </div>
                  <Sparkles className="sparkle absolute -top-4 -right-4 h-8 w-8 text-amber-400 opacity-0 scale-0" />
                  <Sparkles className="sparkle absolute -bottom-2 -left-6 h-6 w-6 text-blue-400 opacity-0 scale-0" />
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl font-black text-[#234C6A] tracking-tight leading-tight">
                    Payment <br /> Verified Successfully!
                  </h1>
                  <p className="text-[#456882] font-medium text-lg max-w-sm mx-auto">
                    Your application boost has been activated. You're now at the
                    top of the list!
                  </p>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <Link href="/job-seeker/applications">
                    <Button className="w-full h-14 rounded-2xl bg-[#234C6A] hover:bg-[#1a3a52] text-white font-black text-sm shadow-xl shadow-blue-900/10 transition-all active:scale-95">
                      Track Application status
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button
                      variant="ghost"
                      className="w-full h-12 rounded-xl font-black text-gray-400 uppercase tracking-widest text-[10px]"
                    >
                      Return to job board
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <div className="animate-in grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-[32px] shadow-lg shadow-blue-900/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Security
                  </p>
                  <p className="font-bold text-[#234C6A]">Verified</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[32px] shadow-lg shadow-blue-900/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Benefit
                  </p>
                  <p className="font-bold text-[#234C6A]">5x Visibility</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="md:col-span-2 space-y-6">
            <Card className="animate-in border-none shadow-xl rounded-[32px] p-8 bg-white/60 backdrop-blur-md border border-white/20">
              <h2 className="text-lg font-black text-[#234C6A] mb-6 flex items-center gap-3">
                <ReceiptText className="h-5 w-5 text-blue-500" />
                Payment Summary
              </h2>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold text-sm">
                    Amount Paid
                  </span>
                  <span className="text-2xl font-black text-[#234C6A] tracking-tight">
                    ${paymentData?.amountTotal?.toFixed(2)}
                  </span>
                </div>

                <div className="h-px bg-gray-100" />

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Transaction ID
                      </p>
                      <p className="text-xs font-bold text-[#234C6A] break-all">
                        {paymentData?.sessionId.slice(0, 20)}...
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Payment Target
                      </p>
                      <p className="text-xs font-bold text-[#234C6A]">
                        Application Rank Boost
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Status
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                          Completed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="animate-in border-none shadow-xl rounded-[32px] p-8 bg-gradient-to-br from-[#234C6A] to-[#456882] text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black">What's Next?</h3>
                  <p className="text-xs text-blue-100 font-medium">
                    Timeline of your boost
                  </p>
                </div>
              </div>
              <p className="text-sm text-blue-50/80 leading-relaxed font-medium">
                Your application is now pinned to the top for the recruiter. You
                will receive a notification as soon as they review your profile.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AppliedSuccessfullyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#234C6A] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
