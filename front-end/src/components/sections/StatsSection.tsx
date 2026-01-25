"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/src/components/ui/card";
import {
  Users2,
  Briefcase,
  Globe,
  Award,
  TrendingUp,
} from "lucide-react";
import gsap from "gsap";

const stats = [
  {
    icon: Briefcase,
    value: 10000,
    suffix: "+",
    label: "Active Jobs",
    description: "New opportunities daily",
    color: "from-[#234C6A] to-[#456882]",
  },
  {
    icon: Users2,
    value: 5000,
    suffix: "+",
    label: "Companies",
    description: "Top employers hiring",
    color: "from-[#456882] to-[#234C6A]",
  },
  {
    icon: Globe,
    value: 1,
    suffix: "M+",
    label: "Job Seekers",
    description: "Trusted by millions",
    color: "from-[#234C6A] to-[#456882]",
  },
  {
    icon: Award,
    value: 95,
    suffix: "%",
    label: "Satisfaction",
    description: "Happy users",
    color: "from-[#456882] to-[#234C6A]",
  },
];

const StatsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            // Animate counters
            stats.forEach((stat, i) => {
              const duration = 2000;
              const steps = 60;
              const increment = stat.value / steps;
              let current = 0;
              const timer = setInterval(() => {
                current += increment;
                if (current >= stat.value) {
                  current = stat.value;
                  clearInterval(timer);
                }
                setCounts((prev) => {
                  const newCounts = [...prev];
                  newCounts[i] = Math.floor(current);
                  return newCounts;
                });
              }, duration / steps);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stat-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".stat-card",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/3 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4">
            <TrendingUp className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Our Impact</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Millions Worldwide
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Join our growing community of professionals and top employers
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card
              key={i}
              className="stat-card p-6 bg-white/10 backdrop-blur-sm border-white/10 hover:bg-white/20 transition-all duration-500 rounded-2xl text-center group"
            >
              <div className={`bg-gradient-to-br ${stat.color} rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-1">
                {counts[i].toLocaleString()}{stat.suffix}
              </p>
              <p className="text-lg font-semibold text-white mb-1">{stat.label}</p>
              <p className="text-sm text-white/60">{stat.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;