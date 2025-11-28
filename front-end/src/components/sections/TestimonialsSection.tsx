import { Card } from "@/src/components/ui/card";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-[#E3E3E3]">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#234C6A]">
            Success Stories
          </h2>
          <p className="text-lg text-[#234C6A]">
            Hear from job seekers who found their dream careers through
            JobHubs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 border border-[#234C6A]/10 bg-[#E3E3E3] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#234C6A]/10 overflow-hidden border border-[#456882]">
                <img
                  src="https://github.com/shadcn.png"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-[#234C6A]">Sarah Johnson</h4>
                <p className="text-sm text-[#456882]">
                  Software Engineer
                </p>
              </div>
            </div>
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-[#456882] text-[#456882]"
                />
              ))}
            </div>
            <p className="text-[#234C6A]">
              {`"JobHubs helped me land my dream role at a top tech company.
              The resume analyzer was incredibly helpful in highlighting
              areas for improvement."`}
            </p>
          </Card>

          <Card className="p-6 border border-[#234C6A]/10 bg-[#E3E3E3] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#234C6A]/10 overflow-hidden border border-[#456882]">
                <img
                  src="https://github.com/shadcn.png"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-[#234C6A]">Michael Chen</h4>
                <p className="text-sm text-[#456882]">
                  Product Manager
                </p>
              </div>
            </div>
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-[#456882] text-[#456882]"
                />
              ))}
            </div>
            <p className="text-[#234C6A]">
              {`"The skill analyzer helped me identify key skills I needed to
              develop. Within 3 months, I was promoted to Senior PM at my
              company."`}
            </p>
          </Card>

          <Card className="p-6 border border-[#234C6A]/10 bg-[#E3E3E3] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#234C6A]/10 overflow-hidden border border-[#456882]">
                <img
                  src="https://github.com/shadcn.png"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-[#234C6A]">Emma Rodriguez</h4>
                <p className="text-sm text-[#456882]">UX Designer</p>
              </div>
            </div>
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-[#456882] text-[#456882]"
                />
              ))}
            </div>
            <p className="text-[#234C6A]">
              {`"The personalized job recommendations saved me hours of
              searching. I found my perfect role in just 2 weeks!"`}
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;