"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Search,
  Briefcase,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FeaturesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".features-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-header",
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 80%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Search,
      title: "Smart Job Search",
      description:
        "Advanced filters and AI-powered recommendations help you find the perfect match quickly.",
      color: "from-[#234C6A] to-[#456882]",
      highlight: "AI Powered",
    },
    {
      icon: Briefcase,
      title: "Quality Opportunities",
      description:
        "Access thousands of verified job listings from top companies across all industries.",
      color: "from-blue-500 to-cyan-500",
      highlight: "Verified",
    },
    {
      icon: Users,
      title: "Direct Connections",
      description:
        "Message employers directly and build relationships that lead to career opportunities.",
      color: "from-green-500 to-emerald-500",
      highlight: "Network",
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description:
        "Track your applications, get insights, and take control of your career journey.",
      color: "from-purple-500 to-pink-500",
      highlight: "Analytics",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description:
        "Your data is protected with enterprise-grade security and privacy controls.",
      color: "from-orange-500 to-amber-500",
      highlight: "Protected",
    },
    {
      icon: Zap,
      title: "Quick Apply",
      description:
        "Apply to multiple jobs with one click using your saved profile and resume.",
      color: "from-rose-500 to-red-500",
      highlight: "1-Click",
    },
  ];

  return (
    <section ref={containerRef} className="py-24 md:py-32 relative bg-[#E3E3E3]">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#234C6A]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#456882]/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4">
        {/* Header */}
        <div className="features-header text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-[#234C6A]/10 text-[#234C6A] border-none mb-4 px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            Why Choose Us
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#234C6A]">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-[#234C6A] to-[#456882] bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-lg text-[#456882]">
            We make job searching and hiring simple, efficient, and successful
            with powerful tools designed for modern professionals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="feature-card p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-none bg-white rounded-2xl group"
            >
              {/* Icon */}
              <div className="relative mb-6">
                <div
                  className={`bg-gradient-to-br ${feature.color} rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <Badge
                  className={`absolute -top-2 -right-2 bg-gradient-to-r ${feature.color} text-white border-none text-xs px-2 py-1`}
                >
                  {feature.highlight}
                </Badge>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3 text-[#234C6A] group-hover:text-[#456882] transition-colors">
                {feature.title}
              </h3>
              <p className="text-[#456882] leading-relaxed">
                {feature.description}
              </p>

              {/* Hover indicator */}
              <div className="mt-6 pt-4 border-t border-[#E3E3E3] opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm text-[#234C6A] font-medium">
                  Learn more →
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-[#456882]">
            Ready to get started?{" "}
            <a
              href="/auth"
              className="text-[#234C6A] font-semibold hover:underline"
            >
              Create your free account
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
