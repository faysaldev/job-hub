"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  XCircle, ArrowRight, RefreshCw, HelpCircle,
  AlertCircle, ShieldAlert, Sparkles, ReceiptText,
  CreditCard, Briefcase, ChevronRight,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import gsap from "gsap";
import Link from "next/link";

const CancelContent = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".animate-in", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
      gsap.from(".cancel-icon", {
        scale: 0,
        rotate: 180,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.2,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const highlights = [
    { icon: ShieldAlert, label: "Safety", value: "Standard", bg: "bg-rose-50", color: "text-rose-600" },
    { icon: HelpCircle, label: "Support", value: "24/7 Available", bg: "bg-blue-50", color: "text-blue-600" },
    { icon: AlertCircle, label: "Status", value: "Standard Application", bg: "bg-amber-50", color: "text-amber-600" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-[#E3E3E3] via-white to-[#E3E3E3] py-16 px-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#456882]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        <div className="grid md:grid-cols-5 gap-8 items-start">
          {/* Main Card */}
          <div className="md:col-span-3 space-y-5">
            <Card className="animate-in border border-white/60 shadow-2xl rounded-3xl p-10 bg-white/80 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-amber-500" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-50 to-amber-50 rounded-full -mr-32 -mt-32 opacity-60" />
              <div className="relative z-10 text-center space-y-8">
                <div className="relative inline-block">
                  <div className="cancel-icon w-24 h-24 bg-gradient-to-br from-rose-500 to-red-600 rounded-3xl flex items-center justify-center shadow-xl shadow-rose-500/25 mx-auto">
                    <XCircle className="h-12 w-12 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Badge className="bg-rose-100 text-rose-700 border-none px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Payment Cancelled or Failed
                  </Badge>
                  <h1 className="text-4xl font-black text-[#234C6A] tracking-tight leading-tight">
                    Application Submited<br />without Boost ⚠️
                  </h1>
                  <p className="text-[#456882] font-medium text-base max-w-md mx-auto leading-relaxed">
                    Don&apos;t worry! Your standard application was **successfully submitted** to the recruiter. However, your profile rank boost payment was not completed.
                  </p>
                </div>
                <div className="pt-4 flex flex-col gap-3">
                  <Link href="/job-seeker/applications">
                    <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white font-black shadow-xl shadow-[#234C6A]/20 transition-all active:scale-95">
                      Track Standard Application
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

            <div className="animate-in grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                <HelpCircle className="h-5 w-5 text-[#456882]" />
                Common Payment Issues
              </h2>
              <div className="space-y-4">
                {[
                  { q: "Was my card charged?", a: "No. If a transaction fails or is cancelled, no funds are captured." },
                  { q: "Is my job application active?", a: "Yes! Your application is active and sent to the recruiter as a standard application." },
                  { q: "Can I try to boost again later?", a: "Yes, you can upgrade your application status to Premium from your Dashboard." },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <h4 className="text-xs font-bold text-[#234C6A] flex items-center gap-1.5">
                      <ChevronRight className="h-3.5 w-3.5 text-rose-500 flex-shrink-0" />
                      {item.q}
                    </h4>
                    <p className="text-xs text-[#456882] leading-relaxed pl-5">{item.a}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="animate-in border-none shadow-xl rounded-3xl p-8 bg-gradient-to-br from-rose-900/90 to-rose-950 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8 blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="font-black">Need Help?</h3>
                    <p className="text-xs text-rose-200">Instant Support Support</p>
                  </div>
                </div>
                <p className="text-xs text-rose-100/80 leading-relaxed">
                  If you faced technical issues during check out, please try again or contact our support team. Your career matters to us.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AppliedCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-bold text-white animate-pulse">Loading Details...</h2>
      </div>
    }>
      <CancelContent />
    </Suspense>
  );
}
