"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2, XCircle, ArrowRight, Sparkles,
  Calendar, ShieldCheck, Package, ReceiptText,
  CreditCard, Briefcase, Rocket, Trophy, Zap,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { useGetPaymentDetailsQuery } from "@/src/redux/features/stripe/stripeApi";
import gsap from "gsap";
import Link from "next/link";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-6" />
      <h2 className="text-xl font-bold text-white animate-pulse">Verifying Payment...</h2>
      <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mt-2">Connecting to Stripe Securely</p>
    </div>
  );
}

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: paymentResponse, isLoading } = useGetPaymentDetailsQuery(sessionId || "", { skip: !sessionId });
  const paymentData = paymentResponse?.data;

  useEffect(() => {
    if (!isLoading) {
      const ctx = gsap.context(() => {
        gsap.from(".animate-in", { opacity: 0, y: 30, duration: 0.8, stagger: 0.15, ease: "power3.out" });
        gsap.from(".success-icon", { scale: 0, rotate: -180, duration: 1, ease: "back.out(1.7)", delay: 0.2 });
        gsap.to(".sparkle", { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(2)", delay: 0.8 });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isLoading]);

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E3E3E3] via-white to-[#E3E3E3] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-10 text-center space-y-6 rounded-3xl shadow-2xl border border-white/60 bg-white/80 backdrop-blur-xl">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#234C6A] mb-2">Invalid Session</h1>
            <p className="text-[#456882] text-sm leading-relaxed">We couldn&apos;t find your payment session. Please check your email or contact support.</p>
          </div>
          <Button onClick={() => router.push("/")} className="w-full h-12 rounded-xl bg-gradient-to-r from-[#234C6A] to-[#456882] text-white font-bold">
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) return <LoadingScreen />;

  const highlights = [
    { icon: ShieldCheck, label: "Security", value: "Verified", bg: "bg-blue-50", color: "text-blue-600" },
    { icon: Zap, label: "Benefit", value: "5× Visibility", bg: "bg-amber-50", color: "text-amber-600" },
    { icon: Trophy, label: "Status", value: "Top Listed", bg: "bg-green-50", color: "text-green-600" },
    { icon: Rocket, label: "Access", value: "Premium", bg: "bg-purple-50", color: "text-purple-600" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-[#E3E3E3] via-white to-[#E3E3E3] py-16 px-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#234C6A]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#456882]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        <div className="grid md:grid-cols-5 gap-8 items-start">
          {/* Main Card */}
          <div className="md:col-span-3 space-y-5">
            <Card className="animate-in border border-white/60 shadow-2xl rounded-3xl p-10 bg-white/80 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#234C6A] to-[#456882]" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full -mr-32 -mt-32 opacity-60" />
              <div className="relative z-10 text-center space-y-8">
                <div className="relative inline-block">
                  <div className="success-icon w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-500/25 mx-auto">
                    <CheckCircle2 className="h-12 w-12 text-white" />
                  </div>
                  <Sparkles className="sparkle absolute -top-4 -right-4 h-8 w-8 text-amber-400 opacity-0 scale-0" />
                  <Sparkles className="sparkle absolute -bottom-2 -left-6 h-6 w-6 text-blue-400 opacity-0 scale-0" />
                </div>
                <div className="space-y-3">
                  <Badge className="bg-green-100 text-green-700 border-none px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Payment Confirmed
                  </Badge>
                  <h1 className="text-4xl font-black text-[#234C6A] tracking-tight leading-tight">
                    Application Boost<br />Activated! 🎉
                  </h1>
                  <p className="text-[#456882] font-medium text-lg max-w-sm mx-auto">
                    You&apos;re now pinned to the top of the recruiter&apos;s list. Get ready for callbacks!
                  </p>
                </div>
                <div className="pt-4 flex flex-col gap-3">
                  <Link href="/job-seeker/applications">
                    <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white font-black shadow-xl shadow-[#234C6A]/20 transition-all active:scale-95">
                      Track Application Status
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/job">
                    <Button variant="ghost" className="w-full h-12 rounded-xl font-semibold text-[#456882] hover:text-[#234C6A] hover:bg-[#234C6A]/5">
                      Return to Job Board
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <div className="animate-in grid grid-cols-2 sm:grid-cols-4 gap-3">
              {highlights.map((h) => (
                <div key={h.label} className="bg-white/80 backdrop-blur-sm border border-white/40 p-4 rounded-2xl shadow-md flex flex-col items-center text-center gap-2">
                  <div className={`w-10 h-10 rounded-xl ${h.bg} flex items-center justify-center`}>
                    <h.icon className={`h-5 w-5 ${h.color}`} />
                  </div>
                  <p className="text-[10px] font-black text-[#456882] uppercase tracking-widest">{h.label}</p>
                  <p className="text-sm font-bold text-[#234C6A]">{h.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-2 space-y-5">
            <Card className="animate-in border border-white/40 shadow-xl rounded-3xl p-8 bg-white/70 backdrop-blur-xl">
              <h2 className="text-lg font-black text-[#234C6A] mb-6 flex items-center gap-3">
                <ReceiptText className="h-5 w-5 text-[#456882]" />
                Payment Summary
              </h2>
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-[#456882] font-medium text-sm">Amount Paid</span>
                  <span className="text-2xl font-black text-[#234C6A]">
                    ${paymentData?.amountTotal?.toFixed(2) ?? "—"}
                  </span>
                </div>
                <div className="h-px bg-[#E3E3E3]" />
                {[
                  { icon: CreditCard, label: "Transaction ID", value: paymentData?.sessionId ? `${paymentData.sessionId.slice(0, 20)}...` : "—" },
                  { icon: Briefcase, label: "Payment Target", value: "Application Rank Boost" },
                  { icon: Package, label: "Status", value: paymentData?.completed ? "Completed" : "Processing" },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#E3E3E3]/50 flex items-center justify-center flex-shrink-0">
                      <row.icon className="h-4 w-4 text-[#456882]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#456882] uppercase tracking-widest">{row.label}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {row.label === "Status" && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                        <span className="text-xs font-bold text-[#234C6A] break-all">{row.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="animate-in border-none shadow-xl rounded-3xl p-8 bg-gradient-to-br from-[#234C6A] to-[#456882] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8 blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-black">What&apos;s Next?</h3>
                    <p className="text-xs text-blue-200">Timeline of your boost</p>
                  </div>
                </div>
                <p className="text-sm text-blue-100/80 leading-relaxed">
                  Your application is pinned to the top. You&apos;ll receive a notification once the recruiter reviews your profile.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AppliedSuccessfullyPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SuccessContent />
    </Suspense>
  );
}
