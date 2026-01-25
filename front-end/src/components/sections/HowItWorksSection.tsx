"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/src/components/ui/card";
import {
  Users,
  Briefcase,
  Target,
  UserPlus,
  Search,
  Trophy,
  ArrowRight,
} from "lucide-react";
import gsap from "gsap";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Sign up and build your professional profile with your resume, skills, and experience.",
    color: "from-[#234C6A] to-[#456882]",
  },
  {
    number: "02",
    icon: Search,
    title: "Find & Apply",
    description: "Browse jobs that match your skills and apply with one click. Get personalized recommendations.",
    color: "from-[#456882] to-[#234C6A]",
  },
  {
    number: "03",
    icon: Trophy,
    title: "Get Hired",
    description: "Connect with employers, attend interviews, and land your dream job.",
    color: "from-[#234C6A] to-[#456882]",
  },
];

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".how-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".how-header",
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".step-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".step-card",
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        ".step-connector",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          delay: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".step-connector",
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 relative bg-white">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-[#456882]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-[#234C6A]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10 px-4">
        <div className="how-header text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#234C6A]/10 rounded-full mb-4">
            <Target className="h-4 w-4 text-[#234C6A]" />
            <span className="text-sm font-medium text-[#234C6A]">Simple Process</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#234C6A]">
            How It Works
          </h2>
          <p className="text-lg text-[#456882]">
            Get started in three simple steps and find your dream job
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {/* Connector lines (hidden on mobile) */}
          <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5">
            <div className="step-connector absolute left-0 w-1/2 h-full bg-gradient-to-r from-[#234C6A] to-[#456882] origin-left" />
          </div>
          <div className="hidden md:block absolute top-24 left-2/3 right-[16.67%] h-0.5">
            <div className="step-connector absolute left-0 w-full h-full bg-gradient-to-r from-[#456882] to-[#234C6A] origin-left" style={{ transitionDelay: "0.2s" }} />
          </div>

          {steps.map((step, i) => (
            <Card
              key={i}
              className="step-card p-8 bg-[#E3E3E3]/50 border-none hover:shadow-xl transition-all duration-500 rounded-2xl group text-center relative"
            >
              {/* Step number badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${step.color} text-white text-sm font-bold shadow-lg`}>
                  {i + 1}
                </span>
              </div>

              {/* Icon */}
              <div className={`bg-gradient-to-br ${step.color} rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className="h-10 w-10 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-[#234C6A] mb-3">{step.title}</h3>
              <p className="text-[#456882] leading-relaxed">{step.description}</p>

              {/* Arrow for non-last items */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-[#234C6A]" />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;