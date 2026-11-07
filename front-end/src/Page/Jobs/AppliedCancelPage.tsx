"use client";

import { useEffect, useRef, Suspense } from "react";
import {
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Headphones,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import gsap from "gsap";
import Link from "next/link";

const CancelContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".animate-in", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const highlights = [
    { icon: ShieldCheck, label: "Safety", value: "Standard Submission", color: "text-neutral-900" },
    { icon: HelpCircle, label: "Support", value: "Help Center Open", color: "text-neutral-900" },
    { icon: AlertCircle, label: "Status", value: "Standard Delivery", color: "text-neutral-900" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f8fafc] py-12 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="grid md:grid-cols-5 gap-6 items-start">
          {/* Main Card */}
          <div className="md:col-span-3 space-y-4">
            <Card className="animate-in border border-[#eaecf0] shadow-xs rounded-2xl p-8 sm:p-10 bg-white text-center space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-600">
                <AlertTriangle className="h-8 w-8" />
              </div>

              <div className="space-y-2">
                <Badge className="bg-amber-50 text-amber-800 border border-amber-200/80 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Payment Cancelled
                </Badge>
                <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight leading-snug">
                  Application Submitted <br className="hidden sm:inline" />without Boost
                </h1>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
                  Your standard application was successfully delivered to the recruiter. However, your optional highlight payment was cancelled.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <Link href="/job-seeker/applications" className="flex-1">
                  <Button className="w-full h-10 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold uppercase tracking-wider text-xs shadow-xs">
                    Track Application
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </Link>
                <Link href="/job" className="flex-1">
                  <Button variant="outline" className="w-full h-10 rounded-xl border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-bold uppercase tracking-wider text-xs">
                    Return to Job Board
                  </Button>
                </Link>
              </div>
            </Card>

            <div className="animate-in grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {highlights.map((h) => (
                <div key={h.label} className="bg-white border border-[#eaecf0] p-3 rounded-xl shadow-xs flex flex-col items-center text-center gap-1">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                    <h.icon className="h-4 w-4 text-neutral-700" />
                  </div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{h.label}</p>
                  <p className="text-xs font-bold text-neutral-900">{h.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: FAQ & Support */}
          <div className="md:col-span-2 space-y-4">
            <Card className="animate-in border border-[#eaecf0] shadow-xs rounded-2xl p-6 bg-white">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-neutral-600" />
                Frequently Asked
              </h2>
              <div className="space-y-3.5">
                {[
                  { q: "Was my card charged?", a: "No. If a transaction fails or is cancelled, no funds are captured." },
                  { q: "Is my job application active?", a: "Yes. Your application is saved and submitted to the employer as a standard applicant." },
                  { q: "Can I highlight later?", a: "You can manage applications from your Job Seeker dashboard at any time." },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <h3 className="text-xs font-bold text-neutral-900 flex items-start gap-1.5">
                      <ChevronRight className="h-3.5 w-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      {item.q}
                    </h3>
                    <p className="text-[11px] text-neutral-500 leading-normal pl-5">{item.a}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="animate-in border border-neutral-800 shadow-xs rounded-2xl p-5 bg-black text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
                  <Headphones className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-white">Need Support?</h3>
                  <p className="text-[10px] text-neutral-400">We are here to help</p>
                </div>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                If you experienced technical issues during checkout, you can re-attempt or reach out through our contact page.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AppliedCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-neutral-700 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <CancelContent />
    </Suspense>
  );
}
