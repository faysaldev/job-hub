import { Card } from "@/src/components/ui/card";
import {
  Search,
  Briefcase,
  Users,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="py-20 md:py-32 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#234C6A]/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#456882]/5 rounded-full blur-3xl animate-blob animation-delay-6000"></div>
      </div>

      <div className="container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#234C6A]">
            Why Choose JobHubs?
          </h2>
          <p className="text-lg text-[#234C6A]">
            We make job searching and hiring simple, efficient, and
            successful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#234C6A]/20 bg-[#E3E3E3]">
            <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-lg w-14 h-14 flex items-center justify-center mb-6 shadow-lg shadow-[#234C6A]/20">
              <Search className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#234C6A]">Smart Job Search</h3>
            <p className="text-[#234C6A]">
              Advanced filters and AI-powered recommendations help you find
              the perfect match quickly.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#234C6A]/20 bg-[#E3E3E3]">
            <div className="bg-gradient-to-br from-[#456882] to-[#234C6A] rounded-lg w-14 h-14 flex items-center justify-center mb-6 shadow-lg shadow-[#456882]/20">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#234C6A]">
              Quality Opportunities
            </h3>
            <p className="text-[#234C6A]">
              Access thousands of verified job listings from top companies
              across all industries.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#234C6A]/20 bg-[#E3E3E3]">
            <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-lg w-14 h-14 flex items-center justify-center mb-6 shadow-lg shadow-[#234C6A]/20">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#234C6A]">
              Direct Connections
            </h3>
            <p className="text-[#234C6A]">
              Message employers directly and build relationships that lead
              to career opportunities.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#234C6A]/20 bg-[#E3E3E3]">
            <div className="bg-gradient-to-br from-[#456882] to-[#234C6A] rounded-lg w-14 h-14 flex items-center justify-center mb-6 shadow-lg shadow-[#456882]/20">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#234C6A]">Career Growth</h3>
            <p className="text-[#234C6A]">
              Track your applications, get insights, and take control of
              your career journey.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#234C6A]/20 bg-[#E3E3E3]">
            <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-lg w-14 h-14 flex items-center justify-center mb-6 shadow-lg shadow-[#234C6A]/20">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#234C6A]">Secure Platform</h3>
            <p className="text-[#234C6A]">
              Your data is protected with enterprise-grade security and
              privacy controls.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#234C6A]/20 bg-[#E3E3E3]">
            <div className="bg-gradient-to-br from-[#456882] to-[#234C6A] rounded-lg w-14 h-14 flex items-center justify-center mb-6 shadow-lg shadow-[#456882]/20">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#234C6A]">Quick Apply</h3>
            <p className="text-[#234C6A]">
              Apply to multiple jobs with one click using your saved profile
              and resume.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;