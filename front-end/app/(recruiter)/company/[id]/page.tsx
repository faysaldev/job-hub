"use client";

import { useParams } from "next/navigation";
import { useGetSingleCompanyQuery } from "@/src/redux/features/company/companyApi";
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Briefcase,
  Mail,
  Phone,
  ArrowLeft,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Target,
  Users2,
  Zap,
  Clock,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { toast } from "sonner";

const CompanyPage = () => {
  const { id } = useParams();
  const {
    data: response,
    isLoading,
    error,
  } = useGetSingleCompanyQuery(id as string);
  const company = response?.data;

  console.log(company);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#234C6A] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#234C6A] font-bold uppercase tracking-widest text-sm">
          Loading Company Profile...
        </p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <Building2 className="h-10 w-10 text-red-400" />
        </div>
        <h3 className="text-2xl font-black text-[#234C6A]">
          Company not found
        </h3>
        <p className="text-gray-500 mt-2 max-w-md">
          We couldn't find the company profile you're looking for. It may have
          been removed or the link might be incorrect.
        </p>
        <Link href="/job" className="mt-8">
          <Button className="rounded-2xl bg-[#234C6A] hover:bg-[#1a3a52] text-white font-bold px-8 h-14">
            Browse Jobs
          </Button>
        </Link>
      </div>
    );
  }

  const stats = [
    { label: "Company Size", value: company.companySize || "N/A", icon: Users },
    {
      label: "Industry",
      value: company.industries || "Technology",
      icon: Briefcase,
    },
    {
      label: "Location",
      value: company.companyLocation || "Global",
      icon: MapPin,
    },
    {
      label: "Since",
      value: new Date(company.createdAt).getFullYear(),
      icon: Calendar,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] pt-32 pb-48 relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400 rounded-full blur-[100px] -ml-48 -mb-48" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
            {/* Logo Wrapper */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-white/20 rounded-[40px] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative w-40 h-40 bg-white rounded-[36px] shadow-2xl flex items-center justify-center p-6 border-8 border-white/10">
                {company.companyLogo ? (
                  <img
                    src={company.companyLogo}
                    alt={company.companyName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Building2 className="w-20 h-20 text-[#234C6A]" />
                )}
              </div>
            </div>

            {/* Title & Info */}
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Badge className="bg-green-400/20 text-green-300 border-green-500/30 px-4 py-1.5 rounded-full font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Verified Employer
                </Badge>
                <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 rounded-full font-bold text-[10px] tracking-widest">
                  {company.industries}
                </Badge>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                {company.companyName}
              </h1>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-blue-100/80 font-medium text-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-300" />
                  {company.companyLocation}
                </div>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Globe className="h-5 w-5 text-blue-300" />
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 -mt-24 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Stats & Details */}
          <div className="lg:col-span-1 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {stats.map((stat, i) => (
                <Card
                  key={i}
                  className="p-6 border-none shadow-xl rounded-3xl bg-white group hover:translate-y-[-4px] transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-[#234C6A] transition-colors">
                      <stat.icon className="h-6 w-6 text-[#234C6A] group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#456882] uppercase tracking-wider">
                        {stat.label}
                      </p>
                      <p className="text-xl font-black text-[#234C6A]">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Contact Card */}
            <Card className="p-8 border-none shadow-xl rounded-[32px] bg-white space-y-6">
              <h3 className="text-xl font-black text-[#234C6A] flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-500" />
                Contact Details
              </h3>
              <div className="space-y-4">
                <div
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    if (company.userId?.email) {
                      navigator.clipboard.writeText(company.userId.email);
                      toast.success("Email copied to clipboard!");
                    }
                  }}
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Email Address
                    </p>
                    <p className="text-[#234C6A] font-bold truncate">
                      {company.userId?.email}
                    </p>
                  </div>
                </div>
                {company.userId?.phoneNumber && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Phone className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Phone Number
                      </p>
                      <p className="text-[#234C6A] font-bold">
                        {company.userId?.phoneNumber}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Side: Main Description & More */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-10 border-none shadow-xl rounded-[40px] bg-white">
              <h2 className="text-3xl font-black text-[#234C6A] mb-8 flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-blue-500" />
                About the Company
              </h2>
              <div className="prose prose-blue max-w-none text-gray-600 font-medium text-lg leading-relaxed whitespace-pre-line">
                {company.description || "No description provided."}
              </div>
            </Card>

            {/* Open Positions Section */}
            {company.jobs && company.jobs.length > 0 && (
              <Card className="p-10 border-none shadow-xl rounded-[40px] bg-white space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-[#234C6A] flex items-center gap-3">
                    <Briefcase className="h-7 w-7 text-blue-500" />
                    Open Positions
                  </h2>
                  <Badge className="bg-blue-50 text-blue-600 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest">
                    {company.jobs.length} Active Jobs
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {company.jobs.map((job: any) => (
                    <div
                      key={job._id}
                      className="group p-6 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-black text-[#234C6A] group-hover:text-blue-600 transition-colors">
                              {job.title}
                            </h3>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-[#456882]">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              {job.location} ({job.locationType})
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-gray-400" />
                              {job.type.replace("-", " ")}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="h-4 w-4 text-emerald-500" />
                              <span className="capitalize">
                                ${job.salaryMin / 1000}k - $
                                {job.salaryMax / 1000}k / {job.salaryPeriod}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Link href={`/job/${job._id}`}>
                          <Button className="rounded-2xl bg-[#234C6A] hover:bg-blue-600 text-white font-black px-8 h-14 shadow-lg transition-all active:scale-95 whitespace-nowrap">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Placeholders for Values / Culture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-8 border-none shadow-lg rounded-3xl bg-gradient-to-br from-blue-50 to-white">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                  <Zap className="h-7 w-7 text-yellow-500" />
                </div>
                <h4 className="text-xl font-black text-[#234C6A] mb-2">
                  Our Mission
                </h4>
                <p className="text-gray-500 font-medium">
                  To innovate and lead in the {company.industries} sector
                  through excellence and technology.
                </p>
              </Card>
              <Card className="p-8 border-none shadow-lg rounded-3xl bg-gradient-to-br from-emerald-50 to-white">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                  <Users2 className="h-7 w-7 text-emerald-500" />
                </div>
                <h4 className="text-xl font-black text-[#234C6A] mb-2">
                  Our Culture
                </h4>
                <p className="text-gray-500 font-medium">
                  We foster a collaborative environment where every team member
                  is empowered to grow.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
