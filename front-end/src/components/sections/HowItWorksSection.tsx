import {
  Users,
  Briefcase,
  Target,
} from "lucide-react";

const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-32 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-[#456882]/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-[#234C6A]/5 rounded-full blur-3xl animate-blob animation-delay-5000"></div>
      </div>

      <div className="container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#234C6A]">
            How It Works
          </h2>
          <p className="text-lg text-[#234C6A]">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-white mx-auto shadow-lg shadow-[#234C6A]/30">
              1
            </div>
            <h3 className="text-xl font-semibold text-[#234C6A]">Create Your Profile</h3>
            <p className="text-[#234C6A]">
              Sign up and build your professional profile with your resume,
              skills, and experience.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="bg-gradient-to-br from-[#456882] to-[#234C6A] rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-white mx-auto shadow-lg shadow-[#456882]/30">
              2
            </div>
            <h3 className="text-xl font-semibold text-[#234C6A]">Find & Apply</h3>
            <p className="text-[#234C6A]">
              Browse jobs that match your skills and apply with one click.
              Get personalized recommendations.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-white mx-auto shadow-lg shadow-[#234C6A]/30">
              3
            </div>
            <h3 className="text-xl font-semibold text-[#234C6A]">Get Hired</h3>
            <p className="text-[#234C6A]">
              Connect with employers, attend interviews, and land your dream
              job.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;