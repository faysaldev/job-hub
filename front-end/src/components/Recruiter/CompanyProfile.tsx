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
  Save,
  Sparkles,
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
      <div className="flex flex-col items-center justify-center rounded-3xl border border-[#234C6A]/10 bg-[#F8FAFC] py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#234C6A]" />
        <p className="mt-3 text-sm font-medium text-[#456882]">
          Loading company profile...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="relative overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white p-6 shadow-sm md:p-8">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-[#234C6A] to-[#456882]" />

        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-[#234C6A]/10 p-3">
              <Building2 className="h-6 w-6 text-[#234C6A]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#234C6A]">
                Company Identity
              </h2>
              <p className="font-medium text-[#456882]">
                Define your brand presence
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isUpdating || isCreating || !isDirty}
            className="h-12 rounded-2xl bg-gradient-to-r from-[#234C6A] to-[#456882] px-8 font-black text-white shadow-lg shadow-[#234C6A]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50"
          >
            {isUpdating || isCreating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left: Branding & Preview */}
          <div className="space-y-8 lg:col-span-4">
            <div className="group relative">
              <Label className="mb-3 block text-sm font-black text-[#234C6A]">
                Company Logo
              </Label>
              <div className="group relative mx-auto flex aspect-square w-full max-w-[240px] items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-[#234C6A]/15 bg-[#F8FAFC] transition-colors group-hover:border-[#234C6A]/40">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Company logo"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="p-6 text-center">
                    <Upload className="mx-auto mb-2 h-10 w-10 text-[#456882]/40" />
                    <p className="text-xs font-semibold text-[#456882]/60">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-[#234C6A]/55 opacity-0 transition-opacity group-hover:opacity-100">
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
                    className="rounded-2xl bg-white/90 font-black text-[#234C6A] hover:bg-white"
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Change Logo"
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#234C6A]/10 bg-[#F8FAFC] p-6">
              <h4 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-[#234C6A]">
                <Sparkles className="h-4 w-4" />
                Live Preview
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-sm">
                    {logoUrl ? (
                      <img src={logoUrl} alt="" className="object-contain" />
                    ) : (
                      <Building2 className="h-5 w-5 text-[#456882]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-sm font-black text-[#234C6A]">
                      {watchedValues.companyName || "Your Company Name"}
                    </p>
                    <p className="text-xs font-medium text-[#456882]">
                      {watchedValues.industries || "Industry"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="rounded-full border-[#234C6A]/10 bg-white px-2 py-1 text-[10px] text-[#456882]"
                  >
                    <Users className="mr-1 h-3 w-3" />{" "}
                    {watchedValues.companySize}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="rounded-full border-[#234C6A]/10 bg-white px-2 py-1 text-[10px] text-[#456882]"
                  >
                    <MapPin className="mr-1 h-3 w-3" />{" "}
                    {watchedValues.companyLocation || "Location"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form Fields */}
          <div className="space-y-6 lg:col-span-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="companyName"
                  className="text-sm font-black text-[#234C6A]"
                >
                  Company Name
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#456882]">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <Input
                    id="companyName"
                    {...register("companyName", { required: true })}
                    placeholder="e.g. TechCorp Inc."
                    className="h-12 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] pl-11 font-medium focus:border-[#234C6A] focus:ring-[#234C6A]/5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="industries"
                  className="text-sm font-black text-[#234C6A]"
                >
                  Industries
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#456882]">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <Input
                    id="industries"
                    {...register("industries", { required: true })}
                    placeholder="e.g. Information Technology"
                    className="h-12 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] pl-11 font-medium focus:border-[#234C6A] focus:ring-[#234C6A]/5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="companySize"
                  className="text-sm font-black text-[#234C6A]"
                >
                  Company Size
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#456882]">
                    <Users className="h-4 w-4" />
                  </div>
                  <select
                    id="companySize"
                    {...register("companySize")}
                    className="flex h-12 w-full appearance-none rounded-2xl border border-[#234C6A]/10 bg-[#F8FAFC] py-2 pl-11 pr-3 text-sm font-medium focus:border-[#234C6A] focus:outline-none focus:ring-2 focus:ring-[#234C6A]/5"
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
                <Label
                  htmlFor="companyLocation"
                  className="text-sm font-black text-[#234C6A]"
                >
                  Location
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#456882]">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <Input
                    id="companyLocation"
                    {...register("companyLocation", { required: true })}
                    placeholder="e.g. San Francisco, CA"
                    className="h-12 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] pl-11 font-medium focus:border-[#234C6A] focus:ring-[#234C6A]/5"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="website"
                  className="text-sm font-black text-[#234C6A]"
                >
                  Website
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#456882]">
                    <Globe className="h-4 w-4" />
                  </div>
                  <Input
                    id="website"
                    {...register("website")}
                    placeholder="https://techcorp.com"
                    className="h-12 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] pl-11 font-medium focus:border-[#234C6A] focus:ring-[#234C6A]/5"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-black text-[#234C6A]"
                >
                  About Company
                </Label>
                <Textarea
                  id="description"
                  {...register("description", { required: true })}
                  placeholder="We build great software..."
                  rows={6}
                  className="rounded-3xl border-[#234C6A]/10 bg-[#F8FAFC] p-4 font-medium focus:border-[#234C6A] focus:ring-[#234C6A]/5"
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
