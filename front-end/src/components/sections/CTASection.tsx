"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import Link from "next/link";
import { ArrowRight, Sparkles, Rocket, Users, CheckCircle } from "lucide-react";
import gsap from "gsap";

const CTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-card",
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-card",
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".cta-stat",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.3,
          ease: "power2.out",
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { icon: Users, value: "500K+", label: "Active Users" },
    { icon: CheckCircle, value: "95%", label: "Success Rate" },
    { icon: Rocket, value: "10K+", label: "Jobs Daily" },
  ];

  return (
    <section ref={sectionRef} className="py-20 md:py-32 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#234C6A]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#456882]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="container relative z-10 px-4">
        <Card className="cta-card p-12 md:p-16 bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] text-white text-center shadow-2xl shadow-[#234C6A]/30 rounded-3xl border-none overflow-hidden relative">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
          </div>

          <div className="max-w-3xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Join the community today</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Ready to Start Your
              <span className="block text-white/90">Career Journey?</span>
            </h2>

            <p className="text-lg md:text-xl mb-10 text-white/80 max-w-2xl mx-auto">
              Join thousands of job seekers who have found their dream
              careers through JobHub. Your next opportunity is just a click away.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {stats.map((stat, i) => (
                <div key={i} className="cta-stat p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                  <stat.icon className="h-6 w-6 mx-auto mb-2 text-white/80" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 py-6 bg-white text-[#234C6A] hover:bg-white/90 hover:shadow-xl transition-all duration-300 rounded-xl font-semibold group"
              >
                <Link href="/auth">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 hover:shadow-lg transition-all duration-300 rounded-xl font-semibold"
              >
                <Link href="/job">Browse Jobs</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CTASection;