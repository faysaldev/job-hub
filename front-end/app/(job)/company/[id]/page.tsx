import { notFound } from "next/navigation";
import Link from "next/link";
import { CompanyProfile } from "@/src/types";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Briefcase,
  Star,
  Mail,
  Phone,
  ArrowLeft,
  Calendar,
  TrendingUp,
  Award,
  Heart,
  Share2,
  CheckCircle,
  Clock,
  DollarSign,
  Sparkles,
  Target,
  Zap,
  Shield,
  Coffee,
} from "lucide-react";

// Function to fetch company data by ID
async function getCompanyById(id: string): Promise<CompanyProfile | null> {
  const mockCompanies: Record<string, CompanyProfile> = {
    techcorp: {
      userId: "techcorp",
      companyName: "TechCorp",
      industry: "Information Technology",
      companySize: "51-200",
      website: "https://techcorp.example.com",
      description:
        "We are an innovative technology company focused on creating cutting-edge solutions for businesses worldwide. Our team of experts delivers exceptional services and products that help organizations thrive in the digital era. We prioritize innovation, collaboration, and employee growth.",
      location: "San Francisco, CA",
      logo: "https://placehold.co/150x150/234C6A/FFFFFF?text=TC",
    },
    designstudio: {
      userId: "designstudio",
      companyName: "DesignStudio",
      industry: "Design & Creative",
      companySize: "11-50",
      website: "https://designstudio.example.com",
      description:
        "We are a creative team of designers focused on delivering beautiful and functional user experiences. Our team creates products that are not only visually appealing but also intuitive and user-friendly. We believe in the power of design to solve problems and create meaningful connections.",
      location: "New York, NY",
      logo: "https://placehold.co/150x150/456882/FFFFFF?text=DS",
    },
  };

  return mockCompanies[id] || null;
}

// Mock open positions data
const mockOpenPositions = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    type: "Full-time",
    location: "San Francisco, CA",
    salary: "$120k - $160k",
    posted: "2 days ago",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    urgent: true,
  },
  {
    id: 2,
    title: "Product Designer",
    type: "Full-time",
    location: "Remote",
    salary: "$90k - $130k",
    posted: "1 week ago",
    skills: ["Figma", "UI/UX", "Design Systems"],
    urgent: false,
  },
  {
    id: 3,
    title: "Backend Engineer",
    type: "Full-time",
    location: "San Francisco, CA",
    salary: "$130k - $170k",
    posted: "3 days ago",
    skills: ["Node.js", "PostgreSQL", "AWS"],
    urgent: false,
  },
];

// Company benefits
const companyBenefits = [
  { icon: Coffee, title: "Free Meals", description: "Daily catered lunch and snacks" },
  { icon: Heart, title: "Health Insurance", description: "Comprehensive medical, dental, vision" },
  { icon: Calendar, title: "Unlimited PTO", description: "Take time when you need it" },
  { icon: TrendingUp, title: "401(k) Match", description: "Up to 4% company matching" },
  { icon: Zap, title: "Learning Budget", description: "$3,000/year for development" },
  { icon: Shield, title: "Parental Leave", description: "16 weeks paid leave" },
];

const CompanyDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const companyId = id;
  const company = await getCompanyById(companyId);

  if (!company) {
    notFound();
  }

  const calculateRating = () => {
    const ratings: Record<string, number> = {
      techcorp: 4.5,
      designstudio: 4.2,
    };
    return ratings[companyId] || 4.0;
  };

  const getJobCount = () => {
    const counts: Record<string, number> = {
      techcorp: 12,
      designstudio: 8,
    };
    return counts[companyId] || 5;
  };

  const stats = [
    { label: "Open Positions", value: getJobCount(), icon: Briefcase },
    { label: "Team Size", value: company.companySize, icon: Users },
    { label: "Company Rating", value: `${calculateRating()}/5`, icon: Star },
    { label: "Founded", value: "2015", icon: Calendar },
  ];

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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
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

            {/* Company Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex items-start gap-6">
                {/* Company Logo */}
                <div className="w-24 h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={`${company.companyName} logo`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Building2 className="h-12 w-12 text-[#234C6A]" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                      Actively Hiring
                    </Badge>
                    <Badge className="bg-white/10 text-white border-white/20">
                      {company.industry}
                    </Badge>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    {company.companyName}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-white/80">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {company.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {company.companySize} employees
                    </span>
                    <span className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {calculateRating()} rating
                    </span>
                    <span className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      {getJobCount()} open positions
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
                  Follow
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
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="p-5 border-none bg-white shadow-lg rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#234C6A]">
                      {stat.value}
                    </p>
                    <p className="text-sm text-[#456882]">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <Card className="p-6 border-none bg-white shadow-lg rounded-2xl">
                <h2 className="text-xl font-bold text-[#234C6A] mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  About {company.companyName}
                </h2>
                <p className="text-[#456882] leading-relaxed mb-6">
                  {company.description}
                </p>

                {/* Company Values */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: Target, title: "Mission", text: "Innovate for impact" },
                    { icon: Sparkles, title: "Vision", text: "Shape the future" },
                    { icon: Award, title: "Values", text: "Excellence first" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-4 bg-gradient-to-br from-[#234C6A]/5 to-[#456882]/5 rounded-xl"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#234C6A]/10 flex items-center justify-center mb-3">
                        <item.icon className="h-5 w-5 text-[#234C6A]" />
                      </div>
                      <h4 className="font-semibold text-[#234C6A] mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-[#456882]">{item.text}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Open Positions */}
              <Card className="p-6 border-none bg-white shadow-lg rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#234C6A] flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Open Positions
                  </h2>
                  <Badge className="bg-[#234C6A]/10 text-[#234C6A]">
                    {mockOpenPositions.length} jobs
                  </Badge>
                </div>

                <div className="space-y-4">
                  {mockOpenPositions.map((position) => (
                    <div
                      key={position.id}
                      className="p-5 border border-[#E3E3E3] rounded-xl hover:border-[#234C6A]/30 hover:shadow-md transition-all group"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-[#234C6A] group-hover:text-[#456882] transition-colors">
                              {position.title}
                            </h3>
                            {position.urgent && (
                              <Badge className="bg-red-100 text-red-600 text-xs">
                                Urgent
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-3 text-sm text-[#456882] mb-3">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {position.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3.5 w-3.5" />
                              {position.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3.5 w-3.5" />
                              {position.salary}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {position.posted}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {position.skills.map((skill, index) => (
                              <Badge
                                key={index}
                                className="bg-[#234C6A]/10 text-[#234C6A] border-none text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Link href={`/job/${position.id}`}>
                          <Button className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white">
                            Apply Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-[#E3E3E3]">
                  <Link href="/job">
                    <Button
                      variant="outline"
                      className="w-full border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/10"
                    >
                      View All Open Positions
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Benefits & Perks */}
              <Card className="p-6 border-none bg-white shadow-lg rounded-2xl">
                <h2 className="text-xl font-bold text-[#234C6A] mb-6 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Benefits & Perks
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {companyBenefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-green-50 rounded-xl"
                    >
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#234C6A]">
                          {benefit.title}
                        </h4>
                        <p className="text-sm text-[#456882]">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Apply Card */}
              <Card className="p-6 border-none bg-white shadow-lg rounded-2xl sticky top-24">
                <h3 className="text-xl font-bold text-[#234C6A] mb-4">
                  Work at {company.companyName}
                </h3>
                <p className="text-[#456882] mb-6">
                  Join an amazing team and build the future together. We are
                  always looking for talented individuals.
                </p>

                <Button className="w-full h-12 bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white rounded-xl font-semibold mb-4">
                  <Briefcase className="h-4 w-4 mr-2" />
                  View All Jobs
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  {company.website && (
                    <Button
                      variant="outline"
                      className="border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/10"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/10"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-[#E3E3E3]">
                  <h4 className="font-semibold text-[#234C6A] mb-4">
                    Company Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="h-4 w-4 text-[#456882]" />
                      <span className="text-[#456882]">{company.industry}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="h-4 w-4 text-[#456882]" />
                      <span className="text-[#456882]">
                        {company.companySize} employees
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-[#456882]" />
                      <span className="text-[#456882]">{company.location}</span>
                    </div>
                    {company.website && (
                      <div className="flex items-center gap-3 text-sm">
                        <Globe className="h-4 w-4 text-[#456882]" />
                        <span className="text-[#456882] truncate">
                          {company.website}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-[#456882]">
                        {calculateRating()}/5 company rating
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Similar Companies */}
              <Card className="p-6 border-none bg-gradient-to-br from-[#234C6A] to-[#456882] text-white rounded-2xl">
                <h3 className="text-lg font-bold mb-2">Similar Companies</h3>
                <p className="text-white/80 text-sm mb-4">
                  Explore other companies in {company.industry}
                </p>
                <Link href="/job">
                  <Button className="w-full bg-white text-[#234C6A] hover:bg-white/90">
                    Browse Companies
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

export default CompanyDetailPage;
