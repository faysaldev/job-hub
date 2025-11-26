import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CompanyProfile as ProfileType } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

const CompanyProfile = ({ userId }: { userId: string }) => {
  const [profile, setProfile] = useState<ProfileType>({
    userId,
    companyName: "",
    industry: "",
    companySize: "",
    website: "",
    description: "",
    location: "",
  });

  useEffect(() => {
    const profiles = JSON.parse(
      localStorage.getItem("companyProfiles") || "{}"
    );
    if (profiles[userId]) {
      setProfile(profiles[userId]);
    }
  }, [userId]);

  const saveProfile = () => {
    const profiles = JSON.parse(
      localStorage.getItem("companyProfiles") || "{}"
    );
    profiles[userId] = profile;
    localStorage.setItem("companyProfiles", JSON.stringify(profiles));
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
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Company Information</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="logo">Company Logo</Label>
            <div className="flex items-center gap-4">
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
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Logo
              </Button>
              {profile.logo && (
                <img
                  src={profile.logo}
                  alt="Company logo"
                  className="h-12 w-12 rounded object-cover"
                />
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={profile.companyName}
              onChange={(e) =>
                setProfile({ ...profile, companyName: e.target.value })
              }
              placeholder="Acme Corporation"
            />
          </div>

          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={profile.industry}
              onChange={(e) =>
                setProfile({ ...profile, industry: e.target.value })
              }
              placeholder="Technology, Healthcare, Finance, etc."
            />
          </div>

          <div>
            <Label htmlFor="companySize">Company Size</Label>
            <select
              id="companySize"
              value={profile.companySize}
              onChange={(e) =>
                setProfile({ ...profile, companySize: e.target.value })
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501-1000">501-1000 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={profile.location}
              onChange={(e) =>
                setProfile({ ...profile, location: e.target.value })
              }
              placeholder="City, Country"
            />
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={profile.website || ""}
              onChange={(e) =>
                setProfile({ ...profile, website: e.target.value })
              }
              placeholder="https://example.com"
            />
          </div>

          <div>
            <Label htmlFor="description">Company Description</Label>
            <Textarea
              id="description"
              value={profile.description}
              onChange={(e) =>
                setProfile({ ...profile, description: e.target.value })
              }
              placeholder="Tell candidates about your company..."
              rows={6}
            />
          </div>
        </div>

        <Button onClick={saveProfile} className="w-full mt-6">
          Save Company Profile
        </Button>
      </Card>
    </div>
  );
};

export default CompanyProfile;
