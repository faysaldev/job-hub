"use client";
import Header from "@/src/components/common/Header";
import ResumeAnalyzer from "@/src/components/analysis/ResumeAnalyzer";
import SkillAnalyzer from "@/src/components/analysis/SkillAnalyzer";
import Footer from "@/src/components/common/Footer";
import HeroSection from "@/src/components/sections/HeroSection";
import FeaturesSection from "@/src/components/sections/FeaturesSection";
import StatsSection from "@/src/components/sections/StatsSection";
import HowItWorksSection from "@/src/components/sections/HowItWorksSection";
import TestimonialsSection from "@/src/components/sections/TestimonialsSection";
import CTASection from "@/src/components/sections/CTASection";

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#E3E3E3]">
      {/* Background pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#234C6A]/10 rounded-full blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#456882]/10 rounded-full blur-3xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#234C6A]/5 to-[#456882]/5 rounded-full blur-3xl opacity-50"></div>
      </div>

      <Header />

      <main className="flex-1 container mx-auto">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <HowItWorksSection />

        {/* Resume Analyzer Section */}
        <section className="py-20">
          <div className="container max-w-6xl mx-auto">
            <ResumeAnalyzer />
          </div>
        </section>

        {/* Skill Analyzer Section */}
        <section className="py-20">
          <div className="container max-w-6xl mx-auto">
            <SkillAnalyzer />
          </div>
        </section>

        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
