"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Building2,
  Briefcase,
  Play,
} from "lucide-react";
import Link from "next/link";
import gsap from "gsap";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-badge",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );

      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
      );

      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: "power2.out" }
      );

      gsap.fromTo(
        ".hero-buttons",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: "power2.out" }
      );

      gsap.fromTo(
        ".hero-stats",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.6, ease: "power2.out" }
      );

      gsap.fromTo(
        ".hero-companies",
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 0.8, ease: "power2.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { icon: Briefcase, label: "Active Jobs", value: "10,000+" },
    { icon: Building2, label: "Companies", value: "5,000+" },
    { icon: Users, label: "Job Seekers", value: "1M+" },
  ];

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] py-24 md:py-32"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/3 rounded-full blur-3xl" />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm animate-float" />
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm animate-float animation-delay-2000" />
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-white/10 rounded-xl backdrop-blur-sm animate-float animation-delay-4000" />
      </div>

      <div className="container relative z-10 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span className="text-white/90 text-sm font-medium">
              #1 Job Platform for Professionals
            </span>
          </div>

          {/* Title */}
          <h1 className="hero-title text-5xl md:text-7xl font-bold leading-tight text-white">
            Find Your Dream Job{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200 bg-clip-text text-transparent">
                Today
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 10C50 2 150 2 198 10"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FDE68A" />
                    <stop offset="100%" stopColor="#FCD34D" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Connect with top employers and discover opportunities that match
            your skills, experience, and career goals.
          </p>

          {/* Buttons */}
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-[#234C6A] hover:bg-white/90 text-lg px-8 py-7 shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold group"
            >
              <Link href="/job">
                Browse Jobs
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-7 border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300 font-semibold"
            >
              <Link href="/auth">
                <Play className="mr-2 h-5 w-5" />
                Post a Job
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="hero-stats flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
              >
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/70">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trusted by */}
          <div className="hero-companies pt-12 border-t border-white/10 mt-12">
            <p className="text-white/60 text-sm mb-6">Trusted by leading companies</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              {["Google", "Microsoft", "Amazon", "Meta", "Apple"].map((company, i) => (
                <div
                  key={i}
                  className="text-white/80 font-bold text-lg tracking-wide"
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#E3E3E3"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
