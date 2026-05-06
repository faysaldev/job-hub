"use client";

import { useEffect, useRef } from "react";
import JobSeekerProfile from "@/src/components/JobSeeker/JobSeekerProfile";
import JobSeekerLayout from "@/src/components/JobSeeker/JobSeekerLayout";
import { useAuth } from "@/src/hooks/useAuth";
import { Card } from "@/src/components/ui/card";
import { Sparkles, User, ShieldCheck } from "lucide-react";
import gsap from "gsap";

export default function SeekerProfilePage() {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".profile-hero",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      );
      gsap.fromTo(
        ".profile-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power2.out" },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <JobSeekerLayout>
      <div ref={containerRef} className="max-w-5xl mx-auto space-y-6">
        {/* ── Hero Banner ── */}
        <div className="profile-hero relative overflow-hidden bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="h-4 w-4 text-green-400" />
                <span className="text-green-300 text-xs font-semibold uppercase tracking-widest">Verified Account</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {user?.name ? `${user.name}'s Profile` : "Your Profile"}
              </h1>
              <p className="text-white/70 text-sm mt-1">
                Keep your professional identity updated and stand out from the crowd
              </p>
            </div>
          </div>
          <Sparkles className="absolute -bottom-6 -right-6 h-40 w-40 text-white/5" />
        </div>

        {/* ── Profile Form Card ── */}
        <Card className="profile-card border border-white/60 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
          {/* Top gradient bar */}
          <div className="h-1 w-full bg-gradient-to-r from-[#234C6A] to-[#456882]" />
          <div className="p-8">
            <JobSeekerProfile userId={user?._id as string} />
          </div>
        </Card>
      </div>
    </JobSeekerLayout>
  );
}
