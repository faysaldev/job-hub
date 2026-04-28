"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building2,
  CheckCircle,
  Share2,
  Heart,
  ArrowLeft,
  Users,
  Globe,
  Sparkles,
  Award,
  Send,
  Loader2,
} from "lucide-react";
import { useGetJobByIdQuery } from "@/src/redux/features/jobs/jobsApi";

interface PopulatedJob {
  _id: string;
  title: string;
  company: {
    _id?: string;
    userId?: string;
    companyName: string;
    companyLogo?: string;
  };
  location: string;
  type: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: string;
  salary?: string;
  posted?: string;
  createdAt?: string;
  description: string;
  skills: string[];
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
}

const JobDetail = () => {
  const params = useParams();
  const details = params?.details as string;

  const { data: apiResponse, isLoading, error } = useGetJobByIdQuery(details);

  // Console log as requested
  console.log("Job detail response:", apiResponse);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E3E3E3]">
        <Loader2 className="h-10 w-10 animate-spin text-[#234C6A]" />
      </div>
    );
  }

  const job = apiResponse?.data as PopulatedJob | undefined;

  if (error || !job) {
    notFound();
  }

  const companyObj = typeof job.company === "object" ? job.company : null;
  const companyName =
    companyObj?.companyName ||
    (typeof job.company === "string" ? job.company : "Unknown Company");
  const companyLogo = companyObj?.companyLogo;
  const salaryRange =
    job.salaryMin && job.salaryMax
      ? `$${job.salaryMin} - $${job.salaryMax} / ${job.salaryPeriod || "monthly"}`
      : job.salary || "Not specified";
  const postedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : job.posted || "Recently";

  return (
    <div className="min-h-screen flex flex-col bg-[#E3E3E3]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] pt-8 pb-32 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumb */}
            <Link
              href="/job"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Link>

            {/* Job Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex items-start gap-6">
                {/* Company Logo */}
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 flex-shrink-0 overflow-hidden">
                  {companyLogo ? (
                    <img
                      src={companyLogo}
                      alt={companyName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-10 w-10 text-white" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                      Actively Hiring
                    </Badge>
                    <Badge className="bg-white/10 text-white border-white/20">
                      {job.type}
                    </Badge>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    {job.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-white/80">
                    <span className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {companyName}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {salaryRange}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Posted {postedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 lg:flex-col xl:flex-row">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 -mt-20 relative z-20 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Skills */}
              <Card className="p-6 border-none bg-white shadow-lg rounded-2xl">
                <h3 className="text-lg font-bold text-[#234C6A] mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-[#234C6A]/10 text-[#234C6A] border-[#234C6A]/20 px-4 py-2"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Job Description */}
              <Card className="p-6 border-none bg-white shadow-lg rounded-2xl">
                <h3 className="text-lg font-bold text-[#234C6A] mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  About This Role
                </h3>
                <p className="text-[#456882] leading-relaxed">
                  {job.description}
                </p>
              </Card>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <Card className="p-6 border-none bg-white shadow-lg rounded-2xl">
                  <h3 className="text-lg font-bold text-[#234C6A] mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Responsibilities
                  </h3>
                  <ul className="space-y-3">
                    {job.responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#234C6A]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="h-4 w-4 text-[#234C6A]" />
                        </div>
                        <span className="text-[#456882]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <Card className="p-6 border-none bg-white shadow-lg rounded-2xl">
                  <h3 className="text-lg font-bold text-[#234C6A] mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Requirements
                  </h3>
                  <ul className="space-y-3">
                    {job.requirements.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-[#456882]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <Card className="p-6 border-none bg-white shadow-lg rounded-2xl">
                  <h3 className="text-lg font-bold text-[#234C6A] mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Benefits & Perks
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {job.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-green-50 rounded-xl"
                      >
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-[#234C6A]">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card className="p-6 border-none bg-white shadow-lg rounded-2xl sticky top-24">
                <h3 className="text-xl font-bold text-[#234C6A] mb-4">
                  Apply for this position
                </h3>
                <p className="text-[#456882] mb-6">
                  Join {companyName} and be part of an amazing team building the
                  future.
                </p>

                <Button className="w-full h-12 bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white rounded-xl font-semibold mb-4 group">
                  <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Apply Now
                </Button>

                <p className="text-center text-sm text-[#456882]">
                  or{" "}
                  <Link
                    href="#"
                    className="text-[#234C6A] font-semibold hover:underline"
                  >
                    Apply with LinkedIn
                  </Link>
                </p>

                <div className="mt-6 pt-6 border-t border-[#E3E3E3]">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-[#456882]">Applications</span>
                    <span className="font-semibold text-[#234C6A]">
                      128 applicants
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#456882]">Posted</span>
                    <span className="font-semibold text-[#234C6A]">
                      {postedDate}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Company Info */}
              <Card className="p-6 border-none bg-white shadow-lg rounded-2xl">
                <h3 className="text-lg font-bold text-[#234C6A] mb-4">
                  About {companyName}
                </h3>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center overflow-hidden">
                    {companyLogo ? (
                      <img
                        src={companyLogo}
                        alt={companyName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-7 w-7 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-[#234C6A]">
                      {companyName}
                    </p>
                    <p className="text-sm text-[#456882]">Technology Company</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="h-4 w-4 text-[#456882]" />
                    <span className="text-[#456882]">500-1000 employees</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="h-4 w-4 text-[#456882]" />
                    <span className="text-[#456882]">
                      www.
                      {companyName.toLowerCase().replace(/[^a-zA-Z0-9]/g, "")}
                      .com
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-[#456882]" />
                    <span className="text-[#456882]">{job.location}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/10"
                >
                  View Company Profile
                </Button>
              </Card>

              {/* Similar Jobs Teaser */}
              <Card className="p-6 border-none bg-gradient-to-br from-[#234C6A] to-[#456882] text-white rounded-2xl">
                <h3 className="text-lg font-bold mb-2">More Jobs Like This</h3>
                <p className="text-white/80 text-sm mb-4">
                  Explore 24 similar positions that match your profile
                </p>
                <Link href="/job">
                  <Button className="w-full bg-white text-[#234C6A] hover:bg-white/90">
                    Browse Similar Jobs
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobDetail;
