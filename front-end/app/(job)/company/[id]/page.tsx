import { notFound } from "next/navigation";
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
  Phone
} from "lucide-react";

// Function to fetch company data by ID
async function getCompanyById(id: string): Promise<CompanyProfile | null> {
  // In a real application, this would be an API call to your backend
  // Example: const response = await fetch(`${process.env.API_URL}/companies/${id}`);

  // For now, we'll return mock data to simulate the API call
  const mockCompanies: Record<string, CompanyProfile> = {
    "techcorp": {
      userId: "techcorp",
      companyName: "TechCorp",
      industry: "Information Technology",
      companySize: "51-200",
      website: "https://techcorp.example.com",
      description: "We are an innovative technology company focused on creating cutting-edge solutions for businesses worldwide. Our team of experts delivers exceptional services and products that help organizations thrive in the digital era. We prioritize innovation, collaboration, and employee growth.",
      location: "San Francisco, CA",
      logo: "https://placehold.co/150x150/234C6A/FFFFFF?text=TC"
    },
    "designstudio": {
      userId: "designstudio",
      companyName: "DesignStudio",
      industry: "Design & Creative",
      companySize: "11-50",
      website: "https://designstudio.example.com",
      description: "We are a creative team of designers focused on delivering beautiful and functional user experiences. Our team creates products that are not only visually appealing but also intuitive and user-friendly. We believe in the power of design to solve problems and create meaningful connections.",
      location: "New York, NY",
      logo: "https://placehold.co/150x150/456882/FFFFFF?text=DS"
    }
  };

  return mockCompanies[id] || null;
}

const CompanyDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const companyId = id;
  const company = await getCompanyById(companyId);

  if (!company) {
    notFound();
  }

  // Calculate company rating based on company ID (for demo purposes)
  const calculateRating = () => {
    // This is just a demo calculation - in a real app, you'd get this from your data
    const ratings: Record<string, number> = {
      "techcorp": 4.5,
      "designstudio": 4.2
    };
    return ratings[companyId] || 0;
  };

  // Calculate number of jobs based on company ID (for demo purposes)
  const getJobCount = () => {
    const counts: Record<string, number> = {
      "techcorp": 12,
      "designstudio": 8
    };
    return counts[companyId] || 0;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E3E3E3]">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Company Header */}
          <Card className="p-8 mb-8 bg-gradient-to-r from-[#234C6A] to-[#456882] text-white rounded-xl border-0">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {company.logo && (
                <div className="bg-white p-2 rounded-xl shadow-lg w-32 h-32 flex items-center justify-center">
                  <img
                    src={company.logo}
                    alt={`${company.companyName} logo`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              )}
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{company.companyName}</h1>
                <p className="text-lg mb-3 opacity-90">{company.industry}</p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white">
                    <Users className="h-4 w-4 mr-1" />
                    {company.companySize} employees
                  </Badge>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white">
                    <MapPin className="h-4 w-4 mr-1" />
                    {company.location}
                  </Badge>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    {calculateRating()}/5 rating
                  </Badge>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {getJobCount()} open positions
                  </Badge>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                  {company.website && (
                    <Button 
                      variant="secondary" 
                      className="bg-white text-[#234C6A] hover:bg-white/90"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  )}
                  <Button 
                    variant="secondary" 
                    className="bg-white text-[#234C6A] hover:bg-white/90"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="bg-white text-[#234C6A] hover:bg-white/90"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* About Section */}
              <Card className="p-6 bg-white border-[#456882]/30 mb-8">
                <h2 className="text-2xl font-bold text-[#234C6A] mb-4">About {company.companyName}</h2>
                <p className="text-[#234C6A] leading-relaxed">
                  {company.description}
                </p>
              </Card>

              {/* Open Positions Section */}
              <Card className="p-6 bg-white border-[#456882]/30">
                <h2 className="text-2xl font-bold text-[#234C6A] mb-4">Open Positions</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="border-b border-[#456882]/20 pb-4 last:border-0">
                      <h3 className="font-semibold text-[#234C6A]">Senior Frontend Developer</h3>
                      <p className="text-[#234C6A]/80">Full-time • San Francisco, CA</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className="bg-[#234C6A]/10 text-[#234C6A] hover:bg-[#234C6A]/20">
                          React
                        </Badge>
                        <Badge className="bg-[#234C6A]/10 text-[#234C6A] hover:bg-[#234C6A]/20">
                          TypeScript
                        </Badge>
                        <Badge className="bg-[#234C6A]/10 text-[#234C6A] hover:bg-[#234C6A]/20">
                          Tailwind CSS
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div>
              {/* Company Info Card */}
              <Card className="p-6 bg-white border-[#456882]/30 mb-6">
                <h3 className="font-semibold mb-4 text-[#234C6A]">Company Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-[#234C6A]">
                    <Building2 className="h-4 w-4" />
                    <span>{company.companyName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#234C6A]">
                    <Briefcase className="h-4 w-4" />
                    <span>{company.industry}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#234C6A]">
                    <Users className="h-4 w-4" />
                    <span>{company.companySize} employees</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#234C6A]">
                    <MapPin className="h-4 w-4" />
                    <span>{company.location}</span>
                  </div>
                  {company.website && (
                    <div className="flex items-center gap-2 text-[#234C6A]">
                      <Globe className="h-4 w-4" />
                      <span>{company.website}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[#234C6A]">
                    <Star className="h-4 w-4 fill-current text-[#456882]" />
                    <span>{calculateRating()}/5 company rating</span>
                  </div>
                </div>
              </Card>

              {/* Follow Button */}
              <Button 
                className="w-full bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white py-6 text-lg"
              >
                Follow Company
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyDetailPage;