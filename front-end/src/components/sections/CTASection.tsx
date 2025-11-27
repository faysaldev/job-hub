import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="py-20 md:py-32 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#234C6A]/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#456882]/10 rounded-full blur-3xl animate-blob animation-delay-3000"></div>
      </div>

      <div className="container relative z-10">
        <Card className="p-12 md:p-16 bg-gradient-to-br from-[#234C6A] to-[#456882] text-white text-center shadow-2xl shadow-[#234C6A]/25">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Career Journey?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of job seekers who have found their dream
              careers through JobHubs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6 bg-white text-[#234C6A] hover:bg-white/90 hover:shadow-lg transition-all duration-300"
              >
                <Link href="/auth">Create Free Account</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-transparent/30 hover:bg-white/10 text-white border-2 border-white/30 hover:shadow-lg transition-all duration-300"
              >
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CTASection;