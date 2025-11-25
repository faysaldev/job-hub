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
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/src/components/ui/card";

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-transparent py-20 md:py-32">
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Find Your Dream Job{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Today
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Connect with top employers and discover opportunities that match
                your skills, experience, and career goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-lg px-8"
                >
                  <Link href="/jobs">
                    Browse Jobs <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-lg px-8"
                >
                  <Link href="/auth">Post a Job</Link>
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span>10,000+ Active Jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span>5,000+ Companies</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span>1M+ Job Seekers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative gradient orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-50" />
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose JobHubs?
              </h2>
              <p className="text-lg text-muted-foreground">
                We make job searching and hiring simple, efficient, and
                successful.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50">
                <div className="bg-primary/10 rounded-lg w-14 h-14 flex items-center justify-center mb-6">
                  <Search className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Job Search</h3>
                <p className="text-muted-foreground">
                  Advanced filters and AI-powered recommendations help you find
                  the perfect match quickly.
                </p>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50">
                <div className="bg-accent/10 rounded-lg w-14 h-14 flex items-center justify-center mb-6">
                  <Briefcase className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Quality Opportunities
                </h3>
                <p className="text-muted-foreground">
                  Access thousands of verified job listings from top companies
                  across all industries.
                </p>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50">
                <div className="bg-primary/10 rounded-lg w-14 h-14 flex items-center justify-center mb-6">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Direct Connections
                </h3>
                <p className="text-muted-foreground">
                  Message employers directly and build relationships that lead
                  to career opportunities.
                </p>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50">
                <div className="bg-accent/10 rounded-lg w-14 h-14 flex items-center justify-center mb-6">
                  <TrendingUp className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Career Growth</h3>
                <p className="text-muted-foreground">
                  Track your applications, get insights, and take control of
                  your career journey.
                </p>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50">
                <div className="bg-primary/10 rounded-lg w-14 h-14 flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure Platform</h3>
                <p className="text-muted-foreground">
                  Your data is protected with enterprise-grade security and
                  privacy controls.
                </p>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50">
                <div className="bg-accent/10 rounded-lg w-14 h-14 flex items-center justify-center mb-6">
                  <Zap className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Quick Apply</h3>
                <p className="text-muted-foreground">
                  Apply to multiple jobs with one click using your saved profile
                  and resume.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground">
                Get started in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold">Create Your Profile</h3>
                <p className="text-muted-foreground">
                  Sign up and build your professional profile with your resume,
                  skills, and experience.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="bg-gradient-to-br from-accent to-accent/80 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-accent-foreground mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold">Find & Apply</h3>
                <p className="text-muted-foreground">
                  Browse jobs that match your skills and apply with one click.
                  Get personalized recommendations.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold">Get Hired</h3>
                <p className="text-muted-foreground">
                  Connect with employers, attend interviews, and land your dream
                  job.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Resume Analyzer Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <ResumeAnalyzer />
          </div>
        </section>

        {/* Skill Analyzer Section */}
        <section className="py-20">
          <div className="container">
            <SkillAnalyzer />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <Card className="p-12 md:p-16 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of job seekers who have found their dream careers
                through JobHubs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8"
                >
                  <Link href="/auth">Create Free Account</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 bg-transparent hover:bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30"
                >
                  <Link href="/jobs">Browse Jobs</Link>
                </Button>
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
