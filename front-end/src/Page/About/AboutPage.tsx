"use client";
import { useEffect, useRef } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import {
  Users,
  Target,
  Award,
  Briefcase,
  TrendingUp,
  Shield,
  Heart,
  Zap,
  Globe,
  Linkedin,
  Twitter,
  CheckCircle,
  Building2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import gsap from "gsap";

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" }
      );
      gsap.fromTo(
        ".hero-badge",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.5, ease: "back.out(1.7)" }
      );

      // Stats counter animation
      gsap.fromTo(
        ".stat-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
          },
        }
      );

      // Mission section animation
      gsap.fromTo(
        ".mission-content",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: missionRef.current,
            start: "top 80%",
          },
        }
      );

      // Values cards animation
      gsap.fromTo(
        ".value-card",
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 80%",
          },
        }
      );

      // Team cards animation
      gsap.fromTo(
        ".team-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: teamRef.current,
            start: "top 80%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const stats = [
    {
      icon: <Users className="h-8 w-8" />,
      value: "500K+",
      label: "Active Job Seekers",
      description: "Professionals trust us daily",
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      value: "25K+",
      label: "Partner Companies",
      description: "From startups to Fortune 500",
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      value: "1M+",
      label: "Jobs Posted",
      description: "New opportunities every day",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      value: "92%",
      label: "Success Rate",
      description: "Candidates placed successfully",
    },
  ];

  const values = [
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Trust & Integrity",
      description:
        "We build lasting relationships through transparency, honesty, and ethical practices in every interaction.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Heart className="h-10 w-10" />,
      title: "People First",
      description:
        "Every decision we make prioritizes the well-being and success of our community members.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: <Zap className="h-10 w-10" />,
      title: "Innovation",
      description:
        "We continuously push boundaries with cutting-edge AI and technology to revolutionize recruitment.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: "Inclusivity",
      description:
        "Creating equal opportunities for everyone, regardless of background, location, or experience level.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Target className="h-10 w-10" />,
      title: "Excellence",
      description:
        "We strive for the highest standards in everything we do, from platform design to customer support.",
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: <Award className="h-10 w-10" />,
      title: "Impact",
      description:
        "Measuring our success by the positive change we bring to careers and businesses worldwide.",
      color: "from-[#234C6A] to-[#456882]",
    },
  ];

  const team = [
    {
      name: "Alexandra Chen",
      role: "Chief Executive Officer",
      bio: "Former VP at LinkedIn with 20+ years transforming how people find meaningful work. Harvard MBA.",
      image: "AC",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Marcus Thompson",
      role: "Chief Technology Officer",
      bio: "Ex-Google engineering lead. Built AI systems serving 100M+ users. Stanford CS PhD.",
      image: "MT",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Sarah Nakamura",
      role: "Chief Product Officer",
      bio: "Product visionary from Spotify. Obsessed with creating delightful user experiences.",
      image: "SN",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "David Rodriguez",
      role: "Chief Revenue Officer",
      bio: "Scaled 3 startups to unicorn status. Expert in B2B enterprise sales and partnerships.",
      image: "DR",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Emily Watson",
      role: "VP of Engineering",
      bio: "Built distributed systems at AWS. Passionate about scalable architecture and team growth.",
      image: "EW",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "James Park",
      role: "VP of Design",
      bio: "Former Apple design lead. Believes in the power of beautiful, functional design.",
      image: "JP",
      linkedin: "#",
      twitter: "#",
    },
  ];

  const milestones = [
    { year: "2018", event: "JobHub founded in San Francisco" },
    { year: "2019", event: "Reached 100K active users" },
    { year: "2020", event: "Launched AI-powered matching" },
    { year: "2021", event: "Expanded to 50+ countries" },
    { year: "2022", event: "Series C funding - $150M" },
    { year: "2023", event: "1 Million successful placements" },
    { year: "2024", event: "Launched enterprise solutions" },
  ];

  return (
    <div className="min-h-screen bg-[#E3E3E3]">
      <Header />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882]"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-white/5 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-8 border border-white/20">
              <Sparkles className="h-4 w-4" />
              <span>Transforming Careers Since 2018</span>
            </div>

            <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Building the Future of
              <span className="block mt-2 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Professional Growth
              </span>
            </h1>

            <p className="hero-subtitle text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
              We are on a mission to connect every professional with their dream
              opportunity and help companies build world-class teams.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-white/90">
              {[
                "AI-Powered Matching",
                "Global Reach",
                "Trusted by Fortune 500",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#E3E3E3"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 -mt-10 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="stat-card p-8 border-none bg-white shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-[#234C6A] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-[#234C6A] mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-[#456882]">{stat.description}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section ref={missionRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="mission-content">
              <span className="inline-block px-4 py-1 bg-[#234C6A]/10 text-[#234C6A] rounded-full text-sm font-semibold mb-6">
                Our Story
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-[#234C6A] mb-6 leading-tight">
                Empowering Millions to Find Their
                <span className="text-[#456882]"> Perfect Career Path</span>
              </h2>
              <p className="text-lg text-[#234C6A]/80 mb-6 leading-relaxed">
                JobHub was born from a simple belief: everyone deserves access to
                opportunities that match their potential. Traditional job boards
                were broken - impersonal, inefficient, and frustrating for both
                candidates and employers.
              </p>
              <p className="text-lg text-[#234C6A]/80 mb-8 leading-relaxed">
                We set out to change that. Using cutting-edge AI and machine
                learning, we have built a platform that truly understands what makes
                a great match - not just skills on paper, but culture fit, growth
                potential, and career aspirations.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Countries", value: "150+" },
                  { label: "Industries", value: "50+" },
                  { label: "Languages", value: "25+" },
                  { label: "Team Members", value: "500+" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 bg-[#E3E3E3] rounded-xl text-center"
                  >
                    <div className="text-2xl font-bold text-[#234C6A]">
                      {item.value}
                    </div>
                    <div className="text-sm text-[#456882]">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Timeline */}
              <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <TrendingUp className="h-6 w-6" />
                  Our Journey
                </h3>
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-16 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm font-bold">
                        {milestone.year}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="h-px bg-white/30 mb-2" />
                        <p className="text-white/90">{milestone.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-20 bg-[#E3E3E3]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-[#234C6A]/10 text-[#234C6A] rounded-full text-sm font-semibold mb-4">
              What Drives Us
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#234C6A] mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-[#456882] max-w-2xl mx-auto">
              These principles guide every decision we make and every feature we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="value-card p-8 border-none bg-white shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden relative"
              >
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${value.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-300 -translate-y-1/2 translate-x-1/2`}
                />
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-[#234C6A] mb-3">
                  {value.title}
                </h3>
                <p className="text-[#456882] leading-relaxed">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-[#234C6A]/10 text-[#234C6A] rounded-full text-sm font-semibold mb-4">
              The People Behind JobHub
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#234C6A] mb-6">
              Leadership Team
            </h2>
            <p className="text-xl text-[#456882] max-w-2xl mx-auto">
              Industry veterans united by a passion for transforming how the world works.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="team-card p-8 border-none bg-white shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white text-3xl font-bold group-hover:scale-105 transition-transform duration-300">
                      {member.image}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#234C6A] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#456882] font-medium mb-4">{member.role}</p>
                  <p className="text-[#234C6A]/70 text-sm mb-6 leading-relaxed">
                    {member.bio}
                  </p>
                  <div className="flex gap-3">
                    <a
                      href={member.linkedin}
                      className="w-10 h-10 rounded-full bg-[#E3E3E3] flex items-center justify-center text-[#234C6A] hover:bg-[#234C6A] hover:text-white transition-all duration-300"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                      href={member.twitter}
                      className="w-10 h-10 rounded-full bg-[#E3E3E3] flex items-center justify-center text-[#234C6A] hover:bg-[#234C6A] hover:text-white transition-all duration-300"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#E3E3E3]">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] p-12 md:p-20">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-8">
                <Sparkles className="h-4 w-4" />
                <span>Join Our Growing Community</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to Transform Your Career Journey?
              </h2>
              <p className="text-xl text-white/80 mb-10 leading-relaxed">
                Join over 500,000 professionals who have already discovered their
                next great opportunity through JobHub.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-[#234C6A] hover:bg-[#E3E3E3] font-semibold px-8 py-6 text-lg rounded-xl group"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-xl"
                >
                  Contact Sales
                </Button>
              </div>

              <p className="text-white/60 text-sm mt-8">
                No credit card required. Start your free trial today.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
