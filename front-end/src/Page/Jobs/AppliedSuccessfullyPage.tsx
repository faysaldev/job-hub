"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Package,
  ReceiptText,
  CreditCard,
  Briefcase,
  Rocket,
  Trophy,
  Zap,
  Calendar,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { useGetPaymentDetailsQuery } from "@/src/redux/features/stripe/stripeApi";
import gsap from "gsap";
import Link from "next/link";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-10 h-10 border-2 border-neutral-700 border-t-white rounded-full animate-spin mb-4" />
      <h2 className="text-sm font-bold text-white uppercase tracking-wider">Verifying Details...</h2>
      <p className="text-neutral-500 text-xs mt-1">Connecting to Stripe securely</p>
    </div>
  );
}

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: paymentResponse, isLoading } = useGetPaymentDetailsQuery(sessionId || "", { skip: !sessionId });
  const paymentData = paymentResponse?.data;
  const paymentConfirmed = !!sessionId && paymentData?.completed === true;
  const paymentProcessing = !!sessionId && !paymentConfirmed;

  useEffect(() => {
    if (!isLoading) {
      const ctx = gsap.context(() => {
        gsap.from(".animate-in", { opacity: 0, y: 20, duration: 0.6, stagger: 0.1, ease: "power2.out" });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isLoading]);

  if (isLoading) return <LoadingScreen />;

  const highlights = [
    { icon: ShieldCheck, label: "Security", value: "Verified", color: "text-neutral-900" },
    { icon: Zap, label: "Benefit", value: paymentConfirmed ? "Verified highlight" : paymentProcessing ? "Payment pending" : "Direct delivery", color: "text-neutral-900" },
    { icon: Trophy, label: "Status", value: paymentConfirmed ? "Paid" : paymentProcessing ? "Awaiting confirmation" : "Submitted", color: "text-neutral-900" },
    { icon: Rocket, label: "Access", value: paymentConfirmed ? "Highlighted" : "Standard", color: "text-neutral-900" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f8fafc] py-12 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="grid md:grid-cols-5 gap-6 items-start">
          {/* Main Confirmation Card */}
          <div className="md:col-span-3 space-y-4">
            <Card className="animate-in border border-[#eaecf0] shadow-xs rounded-2xl p-8 sm:p-10 bg-white text-center space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div className="space-y-2">
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {paymentConfirmed ? "Stripe Payment Confirmed" : paymentProcessing ? "Payment Processing" : "Application Submitted"}
                </Badge>
                <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
                  {paymentConfirmed ? (
                    "Payment Confirmed!"
                  ) : paymentProcessing ? (
                    "Application Saved, Payment Pending"
                  ) : (
                    "Applied Successfully!"
                  )}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
                  {paymentConfirmed
                    ? "Your optional highlight payment is confirmed. It does not guarantee an interview or influence hiring decisions."
                    : paymentProcessing
                    ? "Your application is submitted. Any optional paid highlight remains inactive until confirmed by Stripe."
                    : "Your application has been received by the recruiter. Keep track of updates on your dashboard."}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <Link href="/job-seeker/applications" className="flex-1">
                  <Button className="w-full h-10 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold uppercase tracking-wider text-xs shadow-xs">
                    Track Applications
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </Link>
                <Link href="/job" className="flex-1">
                  <Button variant="outline" className="w-full h-10 rounded-xl border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-bold uppercase tracking-wider text-xs">
                    Browse More Jobs
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Quick Feature Highlights */}
            <div className="animate-in grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {highlights.map((h) => (
                <div key={h.label} className="bg-white border border-[#eaecf0] p-3 rounded-xl shadow-xs flex flex-col items-center text-center gap-1">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                    <h.icon className="h-4 w-4 text-neutral-700" />
                  </div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{h.label}</p>
                  <p className="text-xs font-bold text-neutral-900 truncate max-w-full">{h.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-4">
            {sessionId ? (
              <Card className="animate-in border border-[#eaecf0] shadow-xs rounded-2xl p-6 bg-white">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-2">
                  <ReceiptText className="h-4 w-4 text-neutral-600" />
                  Payment Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                    <span className="text-xs font-medium text-neutral-500">Amount Paid</span>
                    <span className="text-xl font-black text-neutral-900">
                      ${paymentData?.amountTotal?.toFixed(2) ?? "—"}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { icon: CreditCard, label: "Session ID", value: paymentData?.sessionId ? `${paymentData.sessionId.slice(0, 16)}...` : "—" },
                      { icon: Briefcase, label: "Item", value: "Application Highlight" },
                      { icon: Package, label: "Status", value: paymentData?.completed ? "Completed" : "Processing" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                          <row.icon className="h-3.5 w-3.5 text-neutral-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{row.label}</p>
                          <p className="text-xs font-bold text-neutral-900 truncate">{row.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="animate-in border border-[#eaecf0] shadow-xs rounded-2xl p-6 bg-white">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-neutral-600" />
                  Next Steps
                </h2>
                <div className="space-y-3.5">
                  {[
                    { step: "1", title: "Recruiter Review", desc: "The hiring team will review your profile & application." },
                    { step: "2", title: "Notifications", desc: "Receive email updates for interview requests." },
                    { step: "3", title: "Keep Exploring", desc: "Increase your opportunities by applying to other roles." }
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-bold text-xs text-neutral-900">{item.title}</h3>
                        <p className="text-[11px] text-neutral-500 mt-0.5 leading-normal">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card className="animate-in border border-neutral-800 shadow-xs rounded-2xl p-5 bg-black text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-white">Application Timeline</h3>
                  <p className="text-[10px] text-neutral-400">Status updates</p>
                </div>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {paymentConfirmed
                  ? "Your highlight is active. The hiring team evaluates candidate qualifications independently."
                  : "Your application is on file. Monitor your job-seeker dashboard for recruiter activity."}
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
    <Suspense fallback={<LoadingScreen />}>
      <SuccessContent />
    </Suspense>
  );
}
