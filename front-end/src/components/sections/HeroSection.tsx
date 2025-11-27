import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import {
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#234C6A]/5 via-[#456882]/5 to-[#E3E3E3]/30 py-20 md:py-32">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#234C6A]/10 rounded-full blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#456882]/10 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#234C6A]/5 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-[#234C6A]">
            Find Your Dream Job{" "}
            <span className="bg-gradient-to-r from-[#234C6A] via-[#456882] to-[#234C6A] bg-clip-text text-transparent animate-pulse">
              Today
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[#234C6A] max-w-2xl mx-auto">
            Connect with top employers and discover opportunities that match
            your skills, experience, and career goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-lg px-8 py-6 shadow-lg shadow-[#234C6A]/25 hover:shadow-xl hover:shadow-[#234C6A]/30 transition-all duration-300 text-white"
            >
              <Link href="/jobs">
                Browse Jobs <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10 transition-all duration-300"
            >
              <Link href="/auth">Post a Job</Link>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-[#234C6A]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#234C6A]" />
              <span>10,000+ Active Jobs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#456882]" />
              <span>5,000+ Companies</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#234C6A]" />
              <span>1M+ Job Seekers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;