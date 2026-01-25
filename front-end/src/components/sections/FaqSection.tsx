"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { ChevronDown, HelpCircle, MessageCircle, ArrowRight, Plus, Minus } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";

const faqData = [
  {
    question: "How does JobHub match candidates with jobs?",
    answer: "Our advanced algorithm analyzes your skills, experience, and preferences to match you with the most relevant job opportunities. We also consider company culture, location, and salary expectations to ensure the best fit.",
    category: "matching",
  },
  {
    question: "Is there a fee to use JobHub?",
    answer: "JobHub is free for job seekers to use. We charge employers and recruiters for premium features and access to our candidate database. For job seekers, our basic features are completely free.",
    category: "pricing",
  },
  {
    question: "How can I improve my chances of getting hired?",
    answer: "Make sure your profile is complete and up-to-date. Upload a professional resume, add relevant skills, and write an engaging summary. Also, apply to jobs that match your experience and skills, and follow up appropriately.",
    category: "tips",
  },
  {
    question: "How do I report an issue or inappropriate content?",
    answer: "You can report any issues using the 'Report' button on any page or through our Contact page. Our team reviews all reports and takes appropriate action to maintain a safe and professional environment.",
    category: "support",
  },
  {
    question: "Can I apply for jobs anonymously?",
    answer: "Yes, JobHub offers anonymous application options for certain positions. This allows you to apply without revealing your current employer or personal details until you're ready to proceed in the hiring process.",
    category: "privacy",
  },
  {
    question: "How do I change my job preferences?",
    answer: "You can update your job preferences at any time in your account settings. Simply go to your profile, update your location preferences, salary expectations, job types, and other filters.",
    category: "account",
  },
];

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".faq-header",
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".faq-item",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".faq-item",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="py-20 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#234C6A]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#456882]/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="faq-header text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#234C6A]/10 rounded-full mb-4">
            <HelpCircle className="h-4 w-4 text-[#234C6A]" />
            <span className="text-sm font-medium text-[#234C6A]">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#234C6A] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#456882] max-w-2xl mx-auto">
            Find answers to common questions about using JobHub
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <Card
              key={index}
              className={`faq-item border-none overflow-hidden transition-all duration-300 rounded-2xl ${
                activeIndex === index
                  ? "bg-gradient-to-br from-[#234C6A] to-[#456882] shadow-lg"
                  : "bg-[#E3E3E3]/50 hover:bg-[#E3E3E3]"
              }`}
            >
              <button
                className="w-full p-6 text-left flex justify-between items-center gap-4"
                onClick={() => toggleFaq(index)}
              >
                <h3 className={`text-lg font-semibold ${
                  activeIndex === index ? "text-white" : "text-[#234C6A]"
                }`}>
                  {faq.question}
                </h3>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  activeIndex === index
                    ? "bg-white/20"
                    : "bg-[#234C6A]/10"
                }`}>
                  {activeIndex === index ? (
                    <Minus className="h-4 w-4 text-white" />
                  ) : (
                    <Plus className="h-4 w-4 text-[#234C6A]" />
                  )}
                </div>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${
                activeIndex === index ? "max-h-96" : "max-h-0"
              }`}>
                <div className="px-6 pb-6 text-white/90 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <Card className="mt-12 p-8 bg-gradient-to-br from-[#E3E3E3] to-white border-none rounded-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center">
                <MessageCircle className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#234C6A]">Still have questions?</h3>
                <p className="text-[#456882]">Our support team is here to help you</p>
              </div>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white rounded-xl px-6 py-3 font-semibold group"
            >
              <Link href="/contact">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default FaqSection;