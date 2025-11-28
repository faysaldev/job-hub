import {
  Users2,
  Briefcase,
  Globe,
  Award,
} from "lucide-react";

const StatsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#234C6A]/5 via-[#456882]/5 to-[#E3E3E3]/10 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/5 w-80 h-80 bg-[#234C6A]/5 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/5 w-80 h-80 bg-[#456882]/5 rounded-full blur-3xl animate-blob animation-delay-3000"></div>
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-6">
            <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg shadow-[#234C6A]/30">
              <Users2 className="h-8 w-8" />
            </div>
            <p className="text-3xl md:text-4xl font-bold text-[#234C6A]">10K+</p>
            <p className="text-[#234C6A]">Active Jobs</p>
          </div>
          <div className="p-6">
            <div className="bg-gradient-to-br from-[#456882] to-[#234C6A] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg shadow-[#456882]/30">
              <Briefcase className="h-8 w-8" />
            </div>
            <p className="text-3xl md:text-4xl font-bold text-[#234C6A]">5K+</p>
            <p className="text-[#234C6A]">Companies</p>
          </div>
          <div className="p-6">
            <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg shadow-[#234C6A]/30">
              <Globe className="h-8 w-8" />
            </div>
            <p className="text-3xl md:text-4xl font-bold text-[#234C6A]">1M+</p>
            <p className="text-[#234C6A]">Job Seekers</p>
          </div>
          <div className="p-6">
            <div className="bg-gradient-to-br from-[#456882] to-[#234C6A] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg shadow-[#456882]/30">
              <Award className="h-8 w-8" />
            </div>
            <p className="text-3xl md:text-4xl font-bold text-[#234C6A]">95%</p>
            <p className="text-[#234C6A]">Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;