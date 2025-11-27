"use client";
import { Button } from "@/src/components/ui/button";
import Header from "@/src/components/common/Header";
import ResumeAnalyzer from "@/src/components/analysis/ResumeAnalyzer";
import SkillAnalyzer from "@/src/components/analysis/SkillAnalyzer";
import Footer from "@/src/components/common/Footer";
import {
  Search,
  Briefcase,
  Users,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  Star,
  Globe,
  Award,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/src/components/ui/card";

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
        {/* Hero Section */}
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

        {/* Features Section */}
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

        {/* Stats Section */}
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

        {/* How It Works Section */}
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

        {/* Testimonials Section */}
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

        {/* CTA Section */}
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
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
