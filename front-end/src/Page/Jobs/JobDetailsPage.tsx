"use client";

import { useEffect, useRef } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  MapPin, Briefcase, Clock, DollarSign, Building2,
  CheckCircle, Share2, Heart, ArrowLeft, Users,
  Globe, Sparkles, Award, Loader2, CalendarDays,
} from "lucide-react";
import { useGetJobByIdQuery } from "@/src/redux/features/jobs/jobsApi";
import { useSaveJobMutation } from "@/src/redux/features/savedJobs/savedJobsApi";
import { toast } from "sonner";
import ApplyJobModal from "@/src/components/jobs/ApplyJobModal";
import gsap from "gsap";

interface PopulatedJob {
  _id: string;
  title: string;
  company: { _id?: string; userId?: string; companyName: string; companyLogo?: string };
  location: string;
  type: string;
  locationType?: string;
  positions?: number;
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

const JobDetailsPage = () => {
  const params = useParams();
  const details = params?.details as string;
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: apiResponse, isLoading, error } = useGetJobByIdQuery(details);
  const [saveJob, { isLoading: isSaving }] = useSaveJobMutation();

  useEffect(() => {
    if (!isLoading) {
      const ctx = gsap.context(() => {
        gsap.fromTo(".jd-card", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#E3E3E3] via-white to-[#E3E3E3]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-[#234C6A]/30 border-t-[#234C6A] rounded-full animate-spin mx-auto" />
            <p className="text-[#456882] font-medium">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  const job = apiResponse?.data as PopulatedJob | undefined;
  if (error || !job) notFound();

  const companyObj = typeof job.company === "object" ? job.company : null;
  const companyName = companyObj?.companyName || (typeof job.company === "string" ? job.company : "Unknown Company");
  const companyLogo = companyObj?.companyLogo;
  const salaryRange = job.salaryMin && job.salaryMax
    ? `$${job.salaryMin.toLocaleString()} – $${job.salaryMax.toLocaleString()} / ${job.salaryPeriod || "monthly"}`
    : job.salary || "Not specified";
  const postedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : job.posted || "Recently";

  const handleSave = async () => {
    try { await saveJob({ jobId: details }).unwrap(); toast.success("Job saved!"); }
    catch (e: any) { toast.error(e?.data?.message || "Failed to save job."); }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: job.title, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }
    } catch { /* ignore */ }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#E3E3E3] via-white to-[#E3E3E3]">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] pt-8 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Link href="/job" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 text-sm font-medium">
            <ArrowLeft className="h-4 w-4" /> Back to Jobs
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-5">
              {/* Logo */}
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-xl">
                {companyLogo
                  ? <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
                  : <Building2 className="h-10 w-10 text-white" />}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse inline-block" />
                    Actively Hiring
                  </Badge>
                  <Badge className="bg-white/10 text-white border-white/20">{job.type}</Badge>
                  {job.locationType && (
                    <Badge className="bg-white/10 text-white border-white/20">{job.locationType}</Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-5 text-white/80 text-sm">
                  <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" />{companyName}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{job.location}</span>
                  <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4" />{salaryRange}</span>
                  <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />Posted {postedDate}</span>
                  {job.positions && (
                    <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{job.positions} {job.positions === 1 ? "opening" : "openings"}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-wrap">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Heart className="h-4 w-4 mr-2" />}
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div ref={containerRef} className="container mx-auto px-4 -mt-20 relative z-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-5">
            {/* Skills */}
            <Card className="jd-card p-6 border border-white/60 bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl">
              <h3 className="text-lg font-bold text-[#234C6A] mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#456882]" /> Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <Badge key={i} className="bg-[#234C6A]/8 text-[#234C6A] border border-[#234C6A]/15 px-4 py-1.5 font-medium hover:bg-[#234C6A]/15 transition-colors">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Description */}
            <Card className="jd-card p-6 border border-white/60 bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl">
              <h3 className="text-lg font-bold text-[#234C6A] mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#456882]" /> About This Role
              </h3>
              <p className="text-[#456882] leading-relaxed whitespace-pre-line">{job.description}</p>
            </Card>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <Card className="jd-card p-6 border border-white/60 bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl">
                <h3 className="text-lg font-bold text-[#234C6A] mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#456882]" /> Responsibilities
                </h3>
                <ul className="space-y-3">
                  {job.responsibilities.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[#456882]">
                      <div className="w-6 h-6 rounded-full bg-[#234C6A]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-[#234C6A]" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <Card className="jd-card p-6 border border-white/60 bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl">
                <h3 className="text-lg font-bold text-[#234C6A] mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#456882]" /> Requirements
                </h3>
                <ul className="space-y-3">
                  {job.requirements.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[#456882]">
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <Card className="jd-card p-6 border border-white/60 bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl">
                <h3 className="text-lg font-bold text-[#234C6A] mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#456882]" /> Benefits & Perks
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {job.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-[#234C6A] text-sm font-medium">{b}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right */}
          <div className="space-y-5">
            {/* Apply */}
            <Card className="jd-card p-6 border border-white/60 bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl sticky top-24">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#234C6A] to-[#456882] rounded-t-2xl" />
              <h3 className="text-xl font-bold text-[#234C6A] mb-2 mt-2">Apply for this Position</h3>
              <p className="text-[#456882] text-sm mb-5">Join {companyName} and be part of an amazing team.</p>
              <ApplyJobModal jobId={job._id} jobTitle={job.title} companyName={companyName} />
              <div className="mt-4 text-center">
                <span className="text-xs text-[#456882]/50 italic bg-[#E3E3E3]/50 px-3 py-1.5 rounded-full">
                  LinkedIn Apply • Coming Soon
                </span>
              </div>
              <div className="mt-5 pt-5 border-t border-[#E3E3E3]/50 space-y-3">
                {[
                  { label: "Openings", value: job.positions ? `${job.positions} position${job.positions !== 1 ? "s" : ""}` : "N/A" },
                  { label: "Posted", value: postedDate },
                  { label: "Type", value: job.type },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span className="text-[#456882]">{row.label}</span>
                    <span className="font-semibold text-[#234C6A]">{row.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Company */}
            <Card className="jd-card p-6 border border-white/60 bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl">
              <h3 className="font-bold text-[#234C6A] mb-4">About {companyName}</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center overflow-hidden">
                  {companyLogo
                    ? <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
                    : <Building2 className="h-6 w-6 text-white" />}
                </div>
                <div>
                  <p className="font-bold text-[#234C6A]">{companyName}</p>
                  <p className="text-sm text-[#456882]">Technology Company</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-[#456882] mb-5">
                <div className="flex items-center gap-2"><Users className="h-4 w-4" /> 500–1000 employees</div>
                <div className="flex items-center gap-2"><Globe className="h-4 w-4" /> www.{companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com</div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {job.location}</div>
              </div>
              <Link href={`/company/${job.company._id}`} className="text-sm font-semibold text-[#234C6A] hover:underline flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> View Company Profile
              </Link>
            </Card>

            {/* Similar Jobs */}
            <Card className="jd-card p-6 border-none shadow-xl rounded-2xl bg-gradient-to-br from-[#234C6A] to-[#456882] text-white">
              <h3 className="font-bold mb-2">More Jobs Like This</h3>
              <p className="text-white/70 text-sm mb-4">Explore similar positions that match your profile</p>
              <Link href="/job">
                <Button className="w-full bg-white text-[#234C6A] hover:bg-white/90 font-bold">Browse Similar Jobs</Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDetailsPage;
