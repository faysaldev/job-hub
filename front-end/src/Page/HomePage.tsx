/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Search,
  Briefcase,
  TrendingUp,
  Zap,
  Shield,
  Star,
  MapPin,
  Clock,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { jobCategories } from "@/src/lib/jobCategories";

// Featured companies logos (text-based for simplicity)
const featuredCompanies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Apple",
  "Netflix",
];

// Featured jobs preview
const featuredJobs = [
  {
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "Remote",
    salary: "$120k - $180k",
    type: "Full-time",
    posted: "2h ago",
    hot: true,
  },
  {
    title: "Product Designer",
    company: "DesignStudio",
    location: "New York",
    salary: "$90k - $130k",
    type: "Full-time",
    posted: "5h ago",
    hot: false,
  },
  {
    title: "Data Scientist",
    company: "AI Labs",
    location: "San Francisco",
    salary: "$150k - $200k",
    type: "Full-time",
    posted: "1d ago",
    hot: true,
  },
];

function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(
        ".hero-content > *",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" },
      );

      // Floating elements
      gsap.to(".float-1", {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".float-2", {
        y: 20,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".float-3", {
        y: -15,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });

      // Scroll animations
      gsap.utils.toArray(".fade-up").forEach((el: any) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        );
      });

      gsap.utils.toArray(".stagger-item").forEach((el: any, i: number) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="float-1 absolute top-20 left-[10%] w-72 h-72 bg-[#234C6A]/10 rounded-full blur-3xl" />
            <div className="float-2 absolute bottom-20 right-[10%] w-96 h-96 bg-[#456882]/10 rounded-full blur-3xl" />
            <div className="float-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[#234C6A]/5 to-[#456882]/5 rounded-full blur-3xl" />

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#234C6A08_1px,transparent_1px),linear-gradient(to_bottom,#234C6A08_1px,transparent_1px)] bg-[size:60px_60px]" />
          </div>

          <div className="container mx-auto relative z-10 px-4 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left content */}
                <div className="hero-content space-y-8">
                  <Badge className="w-fit bg-[#234C6A]/10 text-[#234C6A] border-none px-4 py-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4 mr-2" />
                    #1 Job Platform — 10,000+ jobs posted daily
                  </Badge>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#234C6A] leading-[1.1]">
                    Find your
                    <span className="block bg-gradient-to-r from-[#234C6A] via-[#456882] to-[#234C6A] bg-clip-text text-transparent">
                      dream job
                    </span>
                    effortlessly
                  </h1>

                  <p className="text-xl text-[#456882] max-w-lg leading-relaxed">
                    Connect with top employers worldwide. Your next career
                    opportunity is just one click away.
                  </p>

                  {/* Search box */}
                  <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-xl shadow-[#234C6A]/10 border border-[#E3E3E3]">
                    <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-[#FAFAFA] rounded-xl">
                      <Search className="h-5 w-5 text-[#456882]" />
                      <input
                        type="text"
                        placeholder="Job title or keyword..."
                        className="flex-1 bg-transparent outline-none text-[#234C6A] placeholder:text-[#456882]/60"
                      />
                    </div>
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white px-8 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      <Link href="/job">
                        Search Jobs
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>

                  {/* Quick stats */}
                  <div className="flex flex-wrap gap-8 pt-4">
                    {[
                      { value: "10K+", label: "Active Jobs" },
                      { value: "5K+", label: "Companies" },
                      { value: "1M+", label: "Job Seekers" },
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <p className="text-3xl font-bold text-[#234C6A]">
                          {stat.value}
                        </p>
                        <p className="text-sm text-[#456882]">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right content - Featured jobs cards */}
                <div className="hidden lg:block relative">
                  <div className="absolute -top-10 -left-10 w-full h-full bg-gradient-to-br from-[#234C6A]/5 to-transparent rounded-3xl" />

                  <div className="relative space-y-4">
                    {featuredJobs.map((job, i) => (
                      <Card
                        key={i}
                        className={`p-5 bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl cursor-pointer group ${
                          i === 1 ? "ml-8" : i === 2 ? "ml-4" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white font-bold text-lg">
                              {job.company[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-[#234C6A] group-hover:text-[#456882] transition-colors">
                                  {job.title}
                                </h3>
                                {job.hot && (
                                  <Badge className="bg-orange-100 text-orange-600 border-none text-xs">
                                    Hot
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-[#456882]">
                                {job.company}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-[#456882]">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {job.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {job.posted}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[#234C6A]">
                              {job.salary}
                            </p>
                            <p className="text-xs text-[#456882]">{job.type}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Floating badge */}
                  <div className="absolute -bottom-6 -right-6 px-4 py-3 bg-gradient-to-r from-[#234C6A] to-[#456882] text-white rounded-2xl shadow-xl">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      <span className="font-semibold">500+ new jobs today</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted by section */}
        <section className="py-12 bg-[#FAFAFA] border-y border-[#E3E3E3]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              <p className="text-sm font-medium text-[#456882]">
                Trusted by leading companies
              </p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                {featuredCompanies.map((company, i) => (
                  <span
                    key={i}
                    className="text-xl font-bold text-[#234C6A]/30 hover:text-[#234C6A]/60 transition-colors cursor-default"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Browse by category */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="fade-up text-center max-w-2xl mx-auto mb-16">
              <Badge className="bg-[#234C6A]/10 text-[#234C6A] border-none px-4 py-2 mb-4">
                Browse Categories
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-[#234C6A] mb-4">
                Explore by category
              </h2>
              <p className="text-lg text-[#456882]">
                Find jobs in your field from thousands of opportunities
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {jobCategories.slice(0, 8).map((category, i) => (
                <Link
                  key={category.id}
                  href={`/job?category=${category.id}`}
                  className="stagger-item"
                >
                  <Card className="p-6 bg-gradient-to-br from-white to-[#FAFAFA] border border-[#E3E3E3] hover:border-[#234C6A]/30 hover:shadow-xl transition-all duration-300 rounded-2xl group cursor-pointer h-full">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <Briefcase className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-[#234C6A] mb-1 group-hover:text-[#456882] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-[#456882]">
                      {category.count.toLocaleString()} jobs
                    </p>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="fade-up text-center mt-12">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A] hover:text-white rounded-xl px-8"
              >
                <Link href="/job">
                  View All Categories
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section className="py-24 bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto relative z-10 px-4">
            <div className="fade-up text-center max-w-2xl mx-auto mb-16">
              <Badge className="bg-white/10 text-white border-none px-4 py-2 mb-4">
                Why JobHub
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Why professionals choose us
              </h2>
              <p className="text-lg text-white/70">
                Everything you need to find and land your dream job
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: Zap,
                  title: "Quick Apply",
                  description:
                    "Apply to jobs with one click using your saved profile",
                },
                {
                  icon: Shield,
                  title: "Verified Jobs",
                  description:
                    "All listings are verified for authenticity and quality",
                },
                {
                  icon: TrendingUp,
                  title: "Career Growth",
                  description:
                    "Get insights and recommendations for career advancement",
                },
              ].map((feature, i) => (
                <Card
                  key={i}
                  className="stagger-item p-8 bg-white/10 backdrop-blur-sm border-white/10 hover:bg-white/20 transition-all duration-300 rounded-2xl text-center group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/70">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 bg-[#FAFAFA]">
          <div className="container mx-auto px-4">
            <div className="fade-up text-center max-w-2xl mx-auto mb-16">
              <Badge className="bg-[#234C6A]/10 text-[#234C6A] border-none px-4 py-2 mb-4">
                Simple Process
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-[#234C6A] mb-4">
                How it works
              </h2>
              <p className="text-lg text-[#456882]">
                Get started in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Create Profile",
                  description:
                    "Sign up and build your professional profile in minutes",
                },
                {
                  step: "02",
                  title: "Find & Apply",
                  description: "Browse jobs and apply with one click",
                },
                {
                  step: "03",
                  title: "Get Hired",
                  description: "Connect with employers and land your dream job",
                },
              ].map((item, i) => (
                <div key={i} className="stagger-item text-center relative">
                  {/* Connector line */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#234C6A]/30 to-transparent" />
                  )}

                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <span className="text-3xl font-bold text-white">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#234C6A] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[#456882]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="fade-up text-center max-w-2xl mx-auto mb-16">
              <Badge className="bg-[#234C6A]/10 text-[#234C6A] border-none px-4 py-2 mb-4">
                Testimonials
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-[#234C6A] mb-4">
                What people say
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Software Engineer at Google",
                  content:
                    "Found my dream job in just 2 weeks! The platform is incredibly easy to use.",
                  rating: 5,
                },
                {
                  name: "Michael Chen",
                  role: "Product Designer at Meta",
                  content:
                    "The job recommendations were spot-on. Highly recommend for anyone job hunting.",
                  rating: 5,
                },
                {
                  name: "Emily Davis",
                  role: "Marketing Manager at Netflix",
                  content:
                    "Best job platform I've used. The application process is seamless.",
                  rating: 5,
                },
              ].map((testimonial, i) => (
                <Card
                  key={i}
                  className="stagger-item p-6 bg-gradient-to-br from-white to-[#FAFAFA] border border-[#E3E3E3] rounded-2xl"
                >
                  <div className="flex gap-1 mb-4">
                    {Array(testimonial.rating)
                      .fill(0)
                      .map((_, j) => (
                        <Star
                          key={j}
                          className="h-5 w-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                  </div>
                  <p className="text-[#456882] mb-6 leading-relaxed">
                    {`"`}
                    {testimonial.content}
                    {`"`}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white font-bold">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-[#234C6A]">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-[#456882]">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[#FAFAFA]">
          <div className="container mx-auto px-4">
            <Card className="fade-up p-12 md:p-20 bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] rounded-3xl border-none text-center relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10 max-w-2xl mx-auto">
                <Badge className="bg-white/10 text-white border-none px-4 py-2 mb-6">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Today
                </Badge>

                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to find your dream job?
                </h2>
                <p className="text-xl text-white/80 mb-10">
                  Join thousands of professionals who have found their perfect
                  career match.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-[#234C6A] hover:bg-white/90 px-8 py-7 text-lg rounded-xl font-semibold shadow-xl group"
                  >
                    <Link href="/auth">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-7 text-lg rounded-xl font-semibold"
                  >
                    <Link href="/job">Browse Jobs</Link>
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
