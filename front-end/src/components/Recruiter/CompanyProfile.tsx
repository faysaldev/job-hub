"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { toast } from "sonner";
import {
  Upload,
  Building2,
  Globe,
  MapPin,
  Users,
  Briefcase,
  Loader2,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import {
  useGetCompanyQuery,
  useUpdateCompanyMutation,
  useCreateCompanyMutation,
} from "@/src/redux/features/company/companyApi";
import { useUploadFileMutation } from "@/src/redux/features/assets/assetsApi";

type CompanyFormValues = {
  companyLogo: string;
  companyName: string;
  industries: string;
  companySize: string;
  companyLocation: string;
  website: string;
  description: string;
};

const CompanyProfile = ({ userId }: { userId: string }) => {
  const { data: companyResponse, isLoading: isFetching } = useGetCompanyQuery();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();
  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const [logoUrl, setLogoUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<CompanyFormValues>({
    defaultValues: {
      companyLogo: "",
      companyName: "",
      industries: "",
      companySize: "1-10",
      companyLocation: "",
      website: "",
      description: "",
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (companyResponse?.data) {
      const data = companyResponse.data;
      const formattedData = {
        companyLogo: data.companyLogo || "",
        companyName: data.companyName || "",
        industries: data.industries || "",
        companySize: data.companySize || "1-10",
        companyLocation: data.companyLocation || "",
        website: data.website || "",
        description: data.description || "",
      };
      reset(formattedData);
      setLogoUrl(data.companyLogo || "");
    }
  }, [companyResponse, reset]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadFile(formData).unwrap();
      if (res?.data?.url) {
        setLogoUrl(res.data.url);
        setValue("companyLogo", res.data.url, { shouldDirty: true });
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload logo");
    }
  };

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      const payload = {
        ...data,
        companyLogo: logoUrl, // Ensure latest logo is used
      };

      if (companyResponse?.data) {
        await updateCompany(payload).unwrap();
        toast.success("Company profile updated successfully!");
      } else {
        await createCompany(payload).unwrap();
        toast.success("Company profile created successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save profile");
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#234C6A]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-8 border-[#456882]/30 bg-white shadow-xl rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#234C6A] via-[#456882] to-[#234C6A]" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#234C6A]/10 rounded-2xl">
              <Building2 className="h-6 w-6 text-[#234C6A]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#234C6A]">Company Identity</h2>
              <p className="text-[#456882] font-medium">Define your brand presence</p>
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={isUpdating || isCreating || !isDirty}
            className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:shadow-lg hover:scale-105 transition-all duration-300 rounded-2xl px-8 h-12 text-white font-bold disabled:opacity-50"
          >
            {(isUpdating || isCreating) ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Branding & Preview */}
          <div className="lg:col-span-4 space-y-8">
            <div className="group relative">
              <Label className="text-sm font-bold text-[#234C6A] mb-3 block">Company Logo</Label>
              <div className="relative aspect-square w-full max-w-[240px] mx-auto rounded-3xl overflow-hidden bg-gray-50 border-2 border-dashed border-[#456882]/20 group-hover:border-[#234C6A]/40 transition-colors flex items-center justify-center group">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Company logo"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="text-center p-6">
                    <Upload className="h-10 w-10 text-[#456882]/40 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-[#456882]/60">PNG, JPG up to 5MB</p>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => document.getElementById("logo-upload")?.click()}
                    className="bg-white/90 text-[#234C6A] hover:bg-white font-bold rounded-xl"
                  >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Change Logo"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
              <h4 className="text-sm font-bold text-[#234C6A] mb-4 uppercase tracking-wider">Live Preview</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center p-2 overflow-hidden">
                    {logoUrl ? <img src={logoUrl} alt="" className="object-contain" /> : <Building2 className="h-5 w-5 text-[#456882]" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#234C6A] line-clamp-1">{watchedValues.companyName || "Your Company Name"}</p>
                    <p className="text-xs font-medium text-[#456882]">{watchedValues.industries || "Industry"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-white border-[#456882]/10 text-[#456882] text-[10px] py-0 px-2">
                    <Users className="h-3 w-3 mr-1" /> {watchedValues.companySize}
                  </Badge>
                  <Badge variant="secondary" className="bg-white border-[#456882]/10 text-[#456882] text-[10px] py-0 px-2">
                    <MapPin className="h-3 w-3 mr-1" /> {watchedValues.companyLocation || "Location"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form Fields */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-bold text-[#234C6A]">Company Name</Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#456882]">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <Input
                    id="companyName"
                    {...register("companyName", { required: true })}
                    placeholder="e.g. TechCorp Inc."
                    className="pl-11 h-12 rounded-xl border-[#456882]/20 focus:border-[#234C6A] focus:ring-[#234C6A]/5 bg-white font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industries" className="text-sm font-bold text-[#234C6A]">Industries</Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#456882]">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <Input
                    id="industries"
                    {...register("industries", { required: true })}
                    placeholder="e.g. Information Technology"
                    className="pl-11 h-12 rounded-xl border-[#456882]/20 focus:border-[#234C6A] focus:ring-[#234C6A]/5 bg-white font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize" className="text-sm font-bold text-[#234C6A]">Company Size</Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#456882]">
                    <Users className="h-4 w-4" />
                  </div>
                  <select
                    id="companySize"
                    {...register("companySize")}
                    className="flex h-12 w-full rounded-xl border border-[#456882]/20 bg-white pl-11 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#234C6A]/5 focus:border-[#234C6A] font-medium appearance-none"
                  >
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyLocation" className="text-sm font-bold text-[#234C6A]">Location</Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#456882]">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <Input
                    id="companyLocation"
                    {...register("companyLocation", { required: true })}
                    placeholder="e.g. San Francisco, CA"
                    className="pl-11 h-12 rounded-xl border-[#456882]/20 focus:border-[#234C6A] focus:ring-[#234C6A]/5 bg-white font-medium"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="website" className="text-sm font-bold text-[#234C6A]">Website</Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#456882]">
                    <Globe className="h-4 w-4" />
                  </div>
                  <Input
                    id="website"
                    {...register("website")}
                    placeholder="https://techcorp.com"
                    className="pl-11 h-12 rounded-xl border-[#456882]/20 focus:border-[#234C6A] focus:ring-[#234C6A]/5 bg-white font-medium"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description" className="text-sm font-bold text-[#234C6A]">About Company</Label>
                <Textarea
                  id="description"
                  {...register("description", { required: true })}
                  placeholder="We build great software..."
                  rows={6}
                  className="rounded-2xl border-[#456882]/20 focus:border-[#234C6A] focus:ring-[#234C6A]/5 bg-white font-medium p-4"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </form>
  );
};

export default CompanyProfile;
