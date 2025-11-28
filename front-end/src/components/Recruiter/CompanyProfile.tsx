import { useState, useEffect } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { CompanyProfile as ProfileType } from "@/src/types";
import { toast } from "@/src/hooks/use-toast";
import { Upload, Building2, Globe, MapPin, Users, Briefcase } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";

const CompanyProfile = ({ userId }: { userId: string }) => {
  // Initialize with dummy data for demonstration
  const [profile, setProfile] = useState<ProfileType>({
    userId,
    companyName: "Tech Innovations Inc.",
    industry: "Information Technology",
    companySize: "51-200",
    website: "https://techinnovations.example.com",
    description: "We are an innovative technology company focused on creating cutting-edge solutions for businesses worldwide. Our team of experts delivers exceptional services and products that help organizations thrive in the digital era. We prioritize innovation, collaboration, and employee growth.",
    location: "San Francisco, CA",
    logo: "https://placehold.co/150x150/234C6A/FFFFFF?text=TI"
  });

  // In a real app, we would load from localStorage
  useEffect(() => {
    // const profiles = JSON.parse(
    //   localStorage.getItem("companyProfiles") || "{}"
    // );
    // if (profiles[userId]) {
    //   setProfile(profiles[userId]);
    // }
  }, [userId]);

  const saveProfile = () => {
    // In a real app, we would save to localStorage
    // const profiles = JSON.parse(
    //   localStorage.getItem("companyProfiles") || "{}"
    // );
    // profiles[userId] = profile;
    // localStorage.setItem("companyProfiles", JSON.stringify(profiles));
    toast({ title: "Company profile saved successfully!" });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border-[#456882]/30 bg-white">
        <h2 className="text-2xl font-bold text-[#234C6A] mb-6">Company Information</h2>
        <div className="space-y-6">
          {/* Company Logo Section */}
          <div className="flex items-center gap-8">
            <div>
              <Label htmlFor="logo" className="text-[#234C6A]">Company Logo</Label>
              <div className="flex items-center gap-4 mt-2">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("logo")?.click()}
                  className="border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
                {profile.logo && (
                  <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-lg w-16 h-16 flex items-center justify-center">
                    <img
                      src={profile.logo}
                      alt="Company logo"
                      className="h-12 w-12 rounded object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold text-[#234C6A]">{profile.companyName}</h3>
              <p className="text-[#234C6A]/70">{profile.industry}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className="bg-[#234C6A]/10 text-[#234C6A] hover:bg-[#234C6A]/20">
                  <Users className="h-3 w-3 mr-1" />
                  {profile.companySize} employees
                </Badge>
                <Badge className="bg-[#234C6A]/10 text-[#234C6A] hover:bg-[#234C6A]/20">
                  <MapPin className="h-3 w-3 mr-1" />
                  {profile.location}
                </Badge>
                <Badge className="bg-[#234C6A]/10 text-[#234C6A] hover:bg-[#234C6A]/20">
                  <Globe className="h-3 w-3 mr-1" />
                  {profile.website}
                </Badge>
              </div>
            </div>
          </div>

          {/* Basic Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="companyName" className="text-[#234C6A]">Company Name</Label>
              <div className="relative mt-2">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#234C6A]">
                  <Building2 className="h-5 w-5" />
                </div>
                <Input
                  id="companyName"
                  value={profile.companyName}
                  onChange={(e) =>
                    setProfile({ ...profile, companyName: e.target.value })
                  }
                  placeholder="Acme Corporation"
                  className="pl-10 border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="industry" className="text-[#234C6A]">Industry</Label>
              <div className="relative mt-2">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#234C6A]">
                  <Briefcase className="h-5 w-5" />
                </div>
                <Input
                  id="industry"
                  value={profile.industry}
                  onChange={(e) =>
                    setProfile({ ...profile, industry: e.target.value })
                  }
                  placeholder="Technology, Healthcare, Finance, etc."
                  className="pl-10 border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="companySize" className="text-[#234C6A]">Company Size</Label>
              <select
                id="companySize"
                value={profile.companySize}
                onChange={(e) =>
                  setProfile({ ...profile, companySize: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-[#456882]/30 bg-white px-3 py-2 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-[#234C6A] focus:border-[#234C6A]"
              >
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>

            <div>
              <Label htmlFor="location" className="text-[#234C6A]">Location</Label>
              <div className="relative mt-2">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#234C6A]">
                  <MapPin className="h-5 w-5" />
                </div>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.target.value })
                  }
                  placeholder="City, Country"
                  className="pl-10 border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="website" className="text-[#234C6A]">Website</Label>
              <div className="relative mt-2">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#234C6A]">
                  <Globe className="h-5 w-5" />
                </div>
                <Input
                  id="website"
                  value={profile.website || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, website: e.target.value })
                  }
                  placeholder="https://example.com"
                  className="pl-10 border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description" className="text-[#234C6A]">Company Description</Label>
              <Textarea
                id="description"
                value={profile.description}
                onChange={(e) =>
                  setProfile({ ...profile, description: e.target.value })
                }
                placeholder="Tell candidates about your company..."
                rows={6}
                className="mt-2 border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={saveProfile}
          className="w-full mt-6 bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
        >
          Save Company Profile
        </Button>
      </Card>
    </div>
  );
};

export default CompanyProfile;
