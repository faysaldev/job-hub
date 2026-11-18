"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Briefcase,
  Upload,
  Save,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { toast } from "sonner";
import {
  useCreateCompanyMutation,
  useGetCompanyByUserIdQuery,
  useUpdateCompanyMutation,
} from "@/src/redux/features/company/companyApi";
import { useUploadFileMutation } from "@/src/redux/features/assets/assetsApi";

interface CompanyFormValues {
  companyName: string;
  companyLocation: string;
  industries: string;
  companySize: string;
  description: string;
  website: string;
  companyLogo?: string;
}

const CompanyProfile = ({ userId }: { userId: string }) => {
  const {
    data: companyResponse,
    isLoading: isFetching,
  } = useGetCompanyByUserIdQuery(userId);

  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const [logoUrl, setLogoUrl] = useState<string>("");

  const company = companyResponse?.data;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<CompanyFormValues>({
    defaultValues: {
      companyName: "",
      companyLocation: "",
      industries: "",
      companySize: "1-10",
      description: "",
      website: "",
      companyLogo: "",
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (company) {
      setValue("companyName", company.companyName || "");
      setValue("companyLocation", company.companyLocation || "");
      setValue("industries", company.industries || "");
      setValue("companySize", company.companySize || "1-10");
      setValue("description", company.description || "");
      setValue("website", company.website || "");
      if (company.companyLogo) {
        setLogoUrl(company.companyLogo);
        setValue("companyLogo", company.companyLogo);
      }
    }
  }, [company, setValue]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      const response = await uploadFile({ file, kind: "logo" }).unwrap();
      const uploadedUrl = response.data?.url;
      if (uploadedUrl) {
        setLogoUrl(uploadedUrl);
        setValue("companyLogo", uploadedUrl, { shouldDirty: true });
        toast.success("Logo uploaded successfully");
      }
    } catch {
      toast.error("Failed to upload logo");
    }
  };

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      const payload = {
        ...data,
        companyLogo: logoUrl || data.companyLogo,
      };

      if (company?._id) {
        await updateCompany({
          companyId: company._id,
          body: payload,
        }).unwrap();
        toast.success("Company profile updated!");
      } else {
        await createCompany(payload).unwrap();
        toast.success("Company profile created!");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save profile");
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#eaecf0] bg-white py-16">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-800" />
        <p className="mt-2 text-xs font-medium text-neutral-500">
          Loading company profile...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-base font-bold text-neutral-950">
            Company Identity
          </h3>
          <p className="text-xs text-neutral-500">
            Define your employer brand across JobHub
          </p>
        </div>

        <Button
          type="submit"
          disabled={isUpdating || isCreating || !isDirty}
          className="h-9 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold uppercase tracking-wider text-xs px-5 shadow-xs disabled:opacity-50"
        >
          {isUpdating || isCreating ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="mr-1.5 h-3.5 w-3.5" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Logo & Live Preview */}
        <div className="space-y-5 lg:col-span-4">
          <div className="space-y-2">
            <Label className="block text-xs font-bold uppercase tracking-wider text-neutral-900">
              Company Logo
            </Label>
            <div className="group relative mx-auto flex aspect-square w-full max-w-[200px] items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#eaecf0] bg-[#f8fafc] transition-colors hover:border-neutral-400">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Company logo"
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <div className="p-4 text-center">
                  <Upload className="mx-auto mb-1.5 h-8 w-8 text-neutral-400" />
                  <p className="text-[11px] font-medium text-neutral-500">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
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
                  className="rounded-xl bg-white text-black hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider h-8 px-3"
                >
                  {isUploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Change Logo"
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-100 bg-[#f8fafc] p-4 space-y-3">
            <h4 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              <Sparkles className="h-3.5 w-3.5 text-neutral-500" />
              Live Preview
            </h4>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white border border-neutral-200 p-1.5 shrink-0">
                {logoUrl ? (
                  <img src={logoUrl} alt="" className="h-full w-full object-contain" />
                ) : (
                  <Building2 className="h-4 w-4 text-neutral-500" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-neutral-900">
                  {watchedValues.companyName || "Your Company Name"}
                </p>
                <p className="text-[11px] text-neutral-500 truncate">
                  {watchedValues.industries || "Industry"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <Badge
                variant="secondary"
                className="rounded-md border-neutral-200 bg-white px-2 py-0.5 text-[10px] text-neutral-600 font-medium"
              >
                <Users className="mr-1 h-3 w-3" />
                {watchedValues.companySize}
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-md border-neutral-200 bg-white px-2 py-0.5 text-[10px] text-neutral-600 font-medium"
              >
                <MapPin className="mr-1 h-3 w-3" />
                {watchedValues.companyLocation || "Location"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right: Form Fields */}
        <div className="space-y-4 lg:col-span-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="companyName"
                className="text-xs font-bold uppercase tracking-wider text-neutral-900"
              >
                Company Name
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  id="companyName"
                  {...register("companyName", { required: true })}
                  placeholder="e.g. Acme Corporation"
                  className="h-10 rounded-xl border border-[#eaecf0] bg-white pl-9 text-xs sm:text-sm font-medium focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="industries"
                className="text-xs font-bold uppercase tracking-wider text-neutral-900"
              >
                Industry
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  id="industries"
                  {...register("industries", { required: true })}
                  placeholder="e.g. Software & Cloud"
                  className="h-10 rounded-xl border border-[#eaecf0] bg-white pl-9 text-xs sm:text-sm font-medium focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="companySize"
                className="text-xs font-bold uppercase tracking-wider text-neutral-900"
              >
                Company Size
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <select
                  id="companySize"
                  {...register("companySize")}
                  className="flex h-10 w-full appearance-none rounded-xl border border-[#eaecf0] bg-white py-1.5 pl-9 pr-3 text-xs sm:text-sm font-medium text-neutral-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
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

            <div className="space-y-1.5">
              <Label
                htmlFor="companyLocation"
                className="text-xs font-bold uppercase tracking-wider text-neutral-900"
              >
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  id="companyLocation"
                  {...register("companyLocation", { required: true })}
                  placeholder="e.g. San Francisco, CA"
                  className="h-10 rounded-xl border border-[#eaecf0] bg-white pl-9 text-xs sm:text-sm font-medium focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label
                htmlFor="website"
                className="text-xs font-bold uppercase tracking-wider text-neutral-900"
              >
                Website
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  id="website"
                  {...register("website")}
                  placeholder="https://company.com"
                  className="h-10 rounded-xl border border-[#eaecf0] bg-white pl-9 text-xs sm:text-sm font-medium focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label
                htmlFor="description"
                className="text-xs font-bold uppercase tracking-wider text-neutral-900"
              >
                About Company
              </Label>
              <Textarea
                id="description"
                {...register("description", { required: true })}
                placeholder="Describe your company culture, mission, and products..."
                rows={5}
                className="rounded-xl border border-[#eaecf0] bg-white p-3.5 text-xs sm:text-sm font-medium leading-relaxed focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CompanyProfile;
