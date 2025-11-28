"use client";
import { useState } from "react";
import { Card } from "@/src/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqData = [
  {
    question: "How does JobHub match candidates with jobs?",
    answer: "Our advanced algorithm analyzes your skills, experience, and preferences to match you with the most relevant job opportunities. We also consider company culture, location, and salary expectations to ensure the best fit."
  },
  {
    question: "Is there a fee to use JobHub?",
    answer: "JobHub is free for job seekers to use. We charge employers and recruiters for premium features and access to our candidate database. For job seekers, our basic features are completely free."
  },
  {
    question: "How can I improve my chances of getting hired?",
    answer: "Make sure your profile is complete and up-to-date. Upload a professional resume, add relevant skills, and write an engaging summary. Also, apply to jobs that match your experience and skills, and follow up appropriately."
  },
  {
    question: "How do I report an issue or inappropriate content?",
    answer: "You can report any issues using the 'Report' button on any page or through our Contact page. Our team reviews all reports and takes appropriate action to maintain a safe and professional environment."
  },
  {
    question: "Can I apply for jobs anonymously?",
    answer: "Yes, JobHub offers anonymous application options for certain positions. This allows you to apply without revealing your current employer or personal details until you're ready to proceed in the hiring process."
  },
  {
    question: "How do I change my job preferences?",
    answer: "You can update your job preferences at any time in your account settings. Simply go to your profile, update your location preferences, salary expectations, job types, and other filters."
  },
  {
    question: "What payment methods do you accept for premium services?",
    answer: "For premium services, we accept all major credit cards including Visa, Mastercard, American Express, and Discover. We also support payment through PayPal for your convenience."
  }
];

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-[#E3E3E3]">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#234C6A] mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-[#234C6A]/80 max-w-2xl mx-auto">
            Find answers to common questions about using JobHub
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <Card 
              key={index} 
              className="border-[#456882]/30 bg-white overflow-hidden transition-all duration-300"
            >
              <button
                className="w-full p-6 text-left flex justify-between items-center"
                onClick={() => toggleFaq(index)}
              >
                <h3 className="text-lg font-semibold text-[#234C6A]">{faq.question}</h3>
                {activeIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-[#234C6A]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#234C6A]" />
                )}
              </button>
              {activeIndex === index && (
                <div className="px-6 pb-6 text-[#234C6A]/80 border-t border-[#456882]/20 pt-4">
                  {faq.answer}
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-[#234C6A]/80 mb-6">
            Still have questions? We're here to help.
          </p>
          <a href="/contact">
            <button className="bg-gradient-to-r from-[#234C6A] to-[#456882] text-white px-6 py-3 rounded-lg hover:from-[#234C6A]/90 hover:to-[#456882]/90 transition-all">
              Contact Us
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;