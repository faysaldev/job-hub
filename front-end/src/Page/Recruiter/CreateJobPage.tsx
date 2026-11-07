"use client";

import { memo, useRef, useCallback, useState, useEffect } from "react";
import {
  useForm,
  FormProvider,
  useWatch,
  useFormContext,
} from "react-hook-form";
import { useAuth } from "@/src/hooks/useAuth";
import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Plus,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  GraduationCap,
  FileText,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  X,
  Loader2,
  Shield,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { jobCategories } from "@/src/lib/jobCategories";
import { useCreateJobMutation, useUpdateJobMutation, useGetJobByIdQuery } from "@/src/redux/features/jobs/jobsApi";
import { toast } from "sonner";
import { Job } from "@/src/types";

// ─── Types ───────────────────────────────────────────────────────────────────

export type CreateJobFormValues = {
  title: string;
  category: string;
  subcategory: string;
  type: string;
  location: string;
  locationType: string;
  salaryMin: string;
  salaryMax: string;
  salaryPeriod: string;
  experienceLevel: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  applicationDeadline: string;
  positions: string;
};

// ─── Shared Badge (stable, defined before use) ───────────────────────────────

const Badge = memo(
  ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={`rounded-full border px-4 py-1.5 text-xs font-black uppercase tracking-wider ${className}`}
    >
      {children}
    </div>
  ),
);
Badge.displayName = "Badge";

// ─── Shared ListManager ───────────────────────────────────────────────────────
// Only re-renders when its own list changes (useWatch is scoped to one field)

const ListManager = memo(
  ({
    name,
    label,
    placeholder,
    icon: Icon,
    variant = "default",
  }: {
    name: "requirements" | "responsibilities" | "benefits" | "skills";
    label: string;
    placeholder: string;
    icon?: React.ElementType;
    variant?: "default" | "badge";
  }) => {
    const { setValue, getValues } = useFormContext<CreateJobFormValues>();
    const items = useWatch({ name }) as string[];
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAdd = useCallback(() => {
      const val = inputRef.current?.value.trim();
      if (!val) return;
      const current = getValues(name) || [];
      if (!current.includes(val)) {
        setValue(name, [...current, val], { shouldDirty: true });
        if (inputRef.current) inputRef.current.value = "";
      }
    }, [getValues, name, setValue]);

    const handleRemove = useCallback(
      (index: number) => {
        const current = getValues(name) || [];
        setValue(
          name,
          current.filter((_, i) => i !== index),
          { shouldDirty: true },
        );
      },
      [getValues, name, setValue],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleAdd();
        }
      },
      [handleAdd],
    );

    return (
      <div className="space-y-4">
        <label className="block text-sm font-black text-[#163B5C]">
          {label}
        </label>
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            className="h-12 rounded-2xl border-[#163B5C]/10 bg-[#F6F8FB] font-medium focus:border-[#163B5C]"
          />
          <Button
            type="button"
            onClick={handleAdd}
            className="h-12 w-12 rounded-2xl bg-[#163B5C] p-0 hover:bg-[#516C83] text-white"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {variant === "badge" ? (
          <div className="flex flex-wrap gap-2">
            {items?.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#163B5C]/10 bg-[#163B5C]/5 px-3 py-1.5 text-sm font-black text-[#163B5C]"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {items?.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="group flex items-center gap-3 rounded-2xl border border-[#163B5C]/10 bg-[#F6F8FB] p-3"
              >
                {Icon && <Icon className="h-4 w-4 text-[#516C83] shrink-0" />}
                <span className="flex-1 text-sm font-semibold text-[#163B5C]">
                  {item}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-[#516C83] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);
ListManager.displayName = "ListManager";

// ─── Step 1: Basic Info ───────────────────────────────────────────────────────

const StepBasicInfo = memo(() => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CreateJobFormValues>();
  const watchedCategory = watch("category"); // scoped — only re-renders this step

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-black text-[#163B5C]">
          <Sparkles className="h-4 w-4 text-[#516C83]" /> Job Title *
        </label>
        <Input
          {...register("title", { required: "Title is required" })}
          placeholder="e.g. Senior Frontend Architect"
          className="h-14 rounded-2xl border-[#163B5C]/10 bg-[#F6F8FB] px-6 text-lg font-medium focus:border-[#163B5C] focus:ring-4 focus:ring-[#163B5C]/5"
        />
        {errors.title && (
          <p className="ml-2 text-xs font-bold text-red-500">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-black text-[#163B5C]">
            Category *
          </label>
          <Select
            value={watch("category") || undefined}
            onValueChange={(val) => {
              setValue("category", val, { shouldValidate: true });
              setValue("subcategory", "", { shouldValidate: true });
            }}
          >
            <SelectTrigger className="h-14 rounded-2xl border-[#163B5C]/10 bg-[#F6F8FB] px-6 font-medium">
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none p-2 shadow-2xl">
              {jobCategories.map((cat) => (
                <SelectItem
                  key={cat.id}
                  value={cat.id}
                  className="rounded-xl focus:bg-[#163B5C]/5"
                >
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black text-[#163B5C]">
            Subcategory *
          </label>
          <Select
            value={watch("subcategory") || undefined}
            disabled={!watchedCategory}
            onValueChange={(val) =>
              setValue("subcategory", val, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-14 rounded-2xl border-[#163B5C]/10 bg-[#F6F8FB] px-6 font-medium">
              <SelectValue placeholder="Specialization" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none p-2 shadow-2xl">
              {jobCategories
                .find((c) => c.id === watchedCategory)
                ?.subcategories.map((sub) => (
                  <SelectItem
                    key={sub.id}
                    value={sub.id}
                    className="rounded-xl focus:bg-[#163B5C]/5"
                  >
                    {sub.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-black text-[#163B5C]">
            Work Arrangement *
          </label>
          <Select
            value={watch("locationType") || "onsite"}
            onValueChange={(val) => setValue("locationType", val, { shouldValidate: true })}
          >
            <SelectTrigger className="h-14 rounded-2xl border-[#163B5C]/10 bg-[#F6F8FB] px-6 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none p-2 shadow-2xl">
              <SelectItem value="onsite" className="rounded-xl">
                On-site
              </SelectItem>
              <SelectItem value="remote" className="rounded-xl">
                Remote
              </SelectItem>
              <SelectItem value="hybrid" className="rounded-xl">
                Hybrid
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black text-[#163B5C]">
            Job Type *
          </label>
          <Select
            value={watch("type") || "full-time"}
            onValueChange={(val) => setValue("type", val, { shouldValidate: true })}
          >
            <SelectTrigger className="h-14 rounded-2xl border-[#163B5C]/10 bg-[#F6F8FB] px-6 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none p-2 shadow-2xl">
              <SelectItem value="full-time" className="rounded-xl">
                Full-Time
              </SelectItem>
              <SelectItem value="part-time" className="rounded-xl">
                Part-Time
              </SelectItem>
              <SelectItem value="contract" className="rounded-xl">
                Contract
              </SelectItem>
              <SelectItem value="freelance" className="rounded-xl">
                Freelance
              </SelectItem>
              <SelectItem value="internship" className="rounded-xl">
                Internship
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-black text-[#163B5C]">
          Primary Location *
        </label>
        <div className="relative group">
          <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#516C83] group-focus-within:text-[#163B5C] transition-colors" />
          <Input
            {...register("location", { required: "Location is required" })}
            placeholder="e.g. San Francisco, CA or Remote"
            className="h-14 rounded-2xl border-[#163B5C]/10 bg-[#F6F8FB] pl-14 font-medium"
          />
        </div>
      </div>
    </div>
  );
});
StepBasicInfo.displayName = "StepBasicInfo";

// ─── Step 2: Details ──────────────────────────────────────────────────────────

const StepDetails = memo(() => {
  const { register, setValue, watch } = useFormContext<CreateJobFormValues>();

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-black text-[#163B5C]">
            Experience Level *
          </label>
          <Select
            value={watch("experienceLevel") || "entry"}
            onValueChange={(val) => setValue("experienceLevel", val, { shouldValidate: true })}
          >
            <SelectTrigger className="h-14 rounded-2xl border-[#163B5C]/10 bg-[#F6F8FB] px-6 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none p-2 shadow-2xl">
              <SelectItem value="entry" className="rounded-xl">
                Entry Level (0-2y)
              </SelectItem>
              <SelectItem value="junior" className="rounded-xl">
                Junior (2-4y)
              </SelectItem>
              <SelectItem value="mid" className="rounded-xl">
                Mid Level (4-6y)
              </SelectItem>
              <SelectItem value="senior" className="rounded-xl">
                Senior (6-10y)
              </SelectItem>
              <SelectItem value="lead" className="rounded-xl">
                Lead/Principal (10y+)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black text-[#163B5C]">
            Open Positions *
          </label>
          <div className="relative">
            <Users className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#516C83]" />
            <Input
              type="number"
              {...register("positions", { required: true, min: 1 })}
              className="h-14 rounded-2xl border-[#163B5C]/10 bg-[#F6F8FB] pl-14 font-medium"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-black text-[#163B5C]">
          Compensation Package (USD)
        </label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative">
            <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#516C83]" />
            <Input
              type="number"
              {...register("salaryMin", { required: true })}
              placeholder="Min"
              className="h-14 rounded-2xl border-[#163B5C]/10 bg-[#F6F8FB] pl-14 font-medium"
            />
          </div>
          <div className="relative">
            <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#516C83]" />
            <Input
              type="number"
              {...register("salaryMax", { required: true })}
              placeholder="Max"
              className="h-14 rounded-2xl border-[#163B5C]/10 bg-[#F6F8FB] pl-14 font-medium"
            />
          </div>
          <Select
            value={watch("salaryPeriod") || "yearly"}
            onValueChange={(val) => setValue("salaryPeriod", val, { shouldValidate: true })}
          >
            <SelectTrigger className="h-14 rounded-2xl border-[#163B5C]/10 bg-[#F6F8FB] px-6 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none p-2 shadow-2xl">
              <SelectItem value="hourly" className="rounded-xl">
                per hour
              </SelectItem>
              <SelectItem value="monthly" className="rounded-xl">
                per month
              </SelectItem>
              <SelectItem value="yearly" className="rounded-xl">
                per year
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-black text-[#163B5C]">
          Application Deadline *
        </label>
        <div className="relative">
          <Clock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#516C83]" />
          <Input
            type="date"
            {...register("applicationDeadline", { required: true })}
            className="h-14 rounded-2xl border-[#163B5C]/10 bg-[#F6F8FB] pl-14 font-medium"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-black text-[#163B5C]">
          Role Description *
        </label>
        <Textarea
          {...register("description", { required: true })}
          placeholder="Paint a picture of the ideal candidate and the impact they'll make..."
          className="min-h-[250px] resize-none rounded-3xl border-[#163B5C]/10 bg-[#F6F8FB] p-8 font-medium leading-relaxed"
        />
      </div>
    </div>
  );
});
StepDetails.displayName = "StepDetails";

// ─── Step 3: Requirements ─────────────────────────────────────────────────────

const StepRequirements = memo(() => (
  <div className="animate-in fade-in space-y-10 duration-500">
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <ListManager
        name="requirements"
        label="Key Requirements"
        placeholder="e.g. 5+ years React experience"
        icon={CheckCircle}
      />
      <ListManager
        name="responsibilities"
        label="Main Responsibilities"
        placeholder="e.g. Lead frontend architecture"
        icon={FileText}
      />
    </div>
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <ListManager
        name="skills"
        label="Technical Skills"
        placeholder="e.g. TypeScript, GraphQL"
        variant="badge"
      />
      <ListManager
        name="benefits"
        label="Benefits & Perks"
        placeholder="e.g. Remote-first culture"
        icon={Sparkles}
      />
    </div>
  </div>
));
StepRequirements.displayName = "StepRequirements";

// ─── Step 4: Review ───────────────────────────────────────────────────────────
// Uses targeted useWatch per field — NOT watch() which subscribes to everything

const StepReview = memo(() => {
  // Each useWatch subscribes only to its field — zero cross-field re-renders
  const title = useWatch<CreateJobFormValues, "title">({ name: "title" });
  const type = useWatch<CreateJobFormValues, "type">({ name: "type" });
  const experienceLevel = useWatch<CreateJobFormValues, "experienceLevel">({
    name: "experienceLevel",
  });
  const salaryMin = useWatch<CreateJobFormValues, "salaryMin">({
    name: "salaryMin",
  });
  const salaryMax = useWatch<CreateJobFormValues, "salaryMax">({
    name: "salaryMax",
  });
  const salaryPeriod = useWatch<CreateJobFormValues, "salaryPeriod">({
    name: "salaryPeriod",
  });
  const location = useWatch<CreateJobFormValues, "location">({
    name: "location",
  });
  const locationType = useWatch<CreateJobFormValues, "locationType">({
    name: "locationType",
  });
  const positions = useWatch<CreateJobFormValues, "positions">({
    name: "positions",
  });
  const applicationDeadline = useWatch<
    CreateJobFormValues,
    "applicationDeadline"
  >({ name: "applicationDeadline" });
  const description = useWatch<CreateJobFormValues, "description">({
    name: "description",
  });
  const requirements = useWatch<CreateJobFormValues, "requirements">({
    name: "requirements",
  });
  const skills = useWatch<CreateJobFormValues, "skills">({ name: "skills" });

  return (
    <div className="animate-in fade-in space-y-10 duration-500">
      {/* Hero card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#163B5C] to-[#516C83] p-8 text-white shadow-2xl shadow-[#163B5C]/20 md:p-10">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[3rem] bg-white/10" />
        <div className="relative space-y-6">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div className="space-y-2">
              <h3 className="text-3xl font-black tracking-tight md:text-4xl">
                {title || "Untitled Position"}
              </h3>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white/20 text-white border-none backdrop-blur-md rounded-lg">
                  {type}
                </Badge>
                <Badge className="bg-white/20 text-white border-none backdrop-blur-md rounded-lg">
                  {experienceLevel}
                </Badge>
              </div>
            </div>
            <div className="lg:text-right">
              <p className="text-sm font-bold opacity-70 uppercase tracking-widest">
                Compensation
              </p>
              <p className="text-3xl font-black">
                ${parseInt(salaryMin || "0").toLocaleString()} - $
                {parseInt(salaryMax || "0").toLocaleString()}
              </p>
              <p className="text-sm font-bold opacity-70">
                per {(salaryPeriod || "year").replace("ly", "")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-5 border-t border-white/10 pt-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 opacity-70" />
              <span className="font-bold">
                {location} ({locationType})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 opacity-70" />
              <span className="font-bold">
                {positions} Opening{Number(positions) !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 opacity-70" />
              <span className="font-bold">Deadline: {applicationDeadline}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 px-1 md:grid-cols-2 md:px-4">
        <div className="space-y-4">
          <h4 className="flex items-center gap-2 text-lg font-black text-[#163B5C]">
            <div className="h-6 w-1.5 rounded-full bg-[#163B5C]" /> Description
          </h4>
          <p className="text-[#516C83] font-medium leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <h4 className="text-lg font-black text-[#163B5C]">Requirements</h4>
            <div className="space-y-2">
              {requirements?.map((req, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <span className="text-[#516C83] font-medium">{req}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-black text-[#163B5C]">Core Skills</h4>
            <div className="flex flex-wrap gap-2">
              {skills?.map((skill, i) => (
                <Badge
                  key={i}
                  className="bg-[#163B5C]/5 text-[#163B5C] border-none font-bold rounded-lg px-4 py-1.5"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
StepReview.displayName = "StepReview";

// ─── Progress Bar ─────────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, title: "Basic Info", icon: Briefcase },
  { number: 2, title: "Details", icon: FileText },
  { number: 3, title: "Requirements", icon: GraduationCap },
  { number: 4, title: "Review", icon: CheckCircle },
] as const;

const ProgressBar = memo(({ currentStep }: { currentStep: number }) => {
  const progressRatio = (currentStep - 1) / (STEPS.length - 1);

  return (
    <div className="relative mb-10 rounded-3xl border border-[#163B5C]/10 bg-white/95 p-5 shadow-sm backdrop-blur md:mb-12 md:p-6">
      <div className="absolute left-6 right-6 top-[2.75rem] h-1 rounded-full bg-[#E1E8EF]" />
      <div
        className="absolute left-6 top-[2.75rem] h-1 rounded-full bg-gradient-to-r from-[#163B5C] to-[#516C83] transition-all duration-500"
        style={{ width: `calc((100% - 3rem) * ${progressRatio})` }}
      />
      <div className="relative flex justify-between">
        {STEPS.map((step) => {
          const active = currentStep >= step.number;
          return (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`z-10 flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 ${
                  active
                    ? "border-2 border-[#163B5C] bg-white text-[#163B5C] shadow-xl shadow-[#163B5C]/10"
                    : "border-2 border-[#E1E8EF] bg-white text-[#516C83]/30"
                }`}
              >
                <step.icon className="h-5 w-5" />
              </div>
              <span
                className={`mt-3 hidden text-xs font-black uppercase tracking-widest sm:block ${
                  active ? "text-[#163B5C]" : "text-[#516C83]/35"
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
ProgressBar.displayName = "ProgressBar";

// ─── Main Page ────────────────────────────────────────────────────────────────

const CreateJobPage = ({ jobId }: { jobId?: string }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createJob, { isLoading }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const { data: editResponse, isFetching: isLoadingJob, isError: jobLoadError } = useGetJobByIdQuery(jobId || "", { skip: !jobId });
  const [publication, setPublication] = useState<"published" | "scheduled">("published");
  const [publishAt, setPublishAt] = useState("");

  const methods = useForm<CreateJobFormValues>({
    defaultValues: {
      title: "",
      category: "",
      subcategory: "",
      type: "full-time",
      location: "",
      locationType: "onsite",
      salaryMin: "",
      salaryMax: "",
      salaryPeriod: "yearly",
      experienceLevel: "entry",
      description: "",
      requirements: [],
      responsibilities: [],
      benefits: [],
      skills: [],
      applicationDeadline: "",
      positions: "1",
    },
  });

  const { handleSubmit } = methods;
  useEffect(() => {
    if (!jobId || !editResponse?.data) return;
    const original = editResponse.data as unknown as Record<string, any>;
    methods.reset({
      title: original.title || "", category: original.category || "", subcategory: original.subcategory || "",
      type: original.type || "full-time", location: original.location || "", locationType: original.locationType || "onsite",
      salaryMin: original.salaryMin != null ? String(original.salaryMin) : "",
      salaryMax: original.salaryMax != null ? String(original.salaryMax) : "",
      salaryPeriod: original.salaryPeriod || "yearly", experienceLevel: original.experienceLevel || "entry",
      description: original.description || "", requirements: original.requirements || [],
      responsibilities: original.responsibilities || [], benefits: original.benefits || [], skills: original.skills || [],
      applicationDeadline: original.applicationDeadline ? new Date(original.applicationDeadline).toISOString().slice(0,10) : "",
      positions: original.positions != null ? String(original.positions) : "1",
    });
    if (original.status === "scheduled") setPublication("scheduled");
    if (original.publishAt) {
      const date = new Date(original.publishAt);
      setPublishAt(new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0,16));
    }
  }, [editResponse, jobId, methods]);

  const saveDraft = async () => {
    const current = methods.getValues();
    if (!current.title.trim()) { toast.error("Enter a title before saving a draft"); return; }
    try {
      const body = { ...current, title: current.title.trim(), status: "draft",
        salaryMin: current.salaryMin.trim() ? Number(current.salaryMin) : undefined,
        salaryMax: current.salaryMax.trim() ? Number(current.salaryMax) : undefined,
        positions: current.positions.trim() ? Number(current.positions) : undefined,
        applicationDeadline: current.applicationDeadline || undefined,
      } as unknown as Partial<Job>;
      if (jobId) await updateJob({ jobId, body }).unwrap();
      else await createJob(body).unwrap();
      toast.success("Draft saved"); router.push("/recruiter/jobs");
    } catch (error: any) { toast.error(error?.data?.message || "Unable to save job draft"); }
  };

  const nextStep = useCallback(
    () => setCurrentStep((p) => Math.min(p + 1, 4)),
    [],
  );
  const prevStep = useCallback(
    () => setCurrentStep((p) => Math.max(p - 1, 1)),
    [],
  );

  const onSubmit = async (data: CreateJobFormValues) => {
    try {
      if (publication === "scheduled" && (!publishAt || new Date(publishAt).getTime() <= Date.now())) {
        toast.error("Choose a future publication date"); return;
      }
      const body = { ...data, salaryMin: Number(data.salaryMin), salaryMax: Number(data.salaryMax),
        positions: Number(data.positions), status: publication,
        ...(publication === "scheduled" ? { publishAt: new Date(publishAt).toISOString() } : {}) } as unknown as Partial<Job>;
      if (jobId) await updateJob({jobId,body}).unwrap(); else await createJob(body).unwrap();
      toast.success(publication === "scheduled" ? "Job scheduled successfully" : "Job published successfully");
      router.push("/recruiter/jobs");
    } catch (error: any) { toast.error(error?.data?.message || "Unable to save job"); }
  };

  if (!user) return null;

  return (
    <RecruiterLayout>
      <div className="mx-auto max-w-6xl space-y-8 pb-20">
        <section className="relative overflow-hidden rounded-3xl bg-[#163B5C] p-7 text-white shadow-2xl shadow-[#163B5C]/20 md:p-9">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="relative z-10 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur-sm">
                <Shield className="h-4 w-4" />
                <span>Opportunity Builder</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                {jobId ? "Edit Opportunity" : "Create Opportunity"}
              </h1>
              <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-white/75">
                Build a complete job post with clear role details, compensation,
                requirements, and review-ready publishing.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button
                className="h-12 rounded-2xl bg-white px-6 font-black text-[#163B5C] hover:bg-[#E1E8EF]"
                onClick={() => router.push("/recruiter/jobs")}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                View Jobs
              </Button>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="h-12 rounded-2xl border-white/30 bg-transparent px-6 font-black text-white hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              label: "Structured Steps",
              value: "4",
              detail: "Basic info to final review",
              icon: BarChart3,
            },
            {
              label: "Reusable Lists",
              value: "Live",
              detail: "Skills, benefits, and requirements",
              icon: Sparkles,
            },
            {
              label: "Publish Flow",
              value: "API",
              detail: "Uses your existing create-job mutation",
              icon: CheckCircle,
            },
          ].map((item) => (
            <Card
              key={item.label}
              className="rounded-3xl border border-[#163B5C]/10 bg-white/95 p-5 shadow-sm backdrop-blur"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#163B5C]/10 text-[#163B5C]">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black text-[#163B5C]">{item.value}</p>
              <p className="mt-1 text-xs font-black uppercase tracking-widest text-[#516C83]">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-medium text-[#516C83]/80">
                {item.detail}
              </p>
            </Card>
          ))}
        </div>

        {jobLoadError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load this job for editing. Check your company permissions.</p>}
        {isLoadingJob && <div className="h-20 animate-pulse rounded-lg bg-slate-100" aria-label="Loading job"/>}
        <ProgressBar currentStep={currentStep} />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="relative overflow-hidden rounded-3xl border border-[#163B5C]/10 bg-white/95 p-6 shadow-2xl shadow-[#163B5C]/10 backdrop-blur md:p-10 lg:p-12">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#163B5C] to-[#516C83]" />

              {/* Mount all steps but hide inactive — avoids RHF field unmount/remount */}
              <div className={currentStep === 1 ? "block" : "hidden"}>
                <StepBasicInfo />
              </div>
              <div className={currentStep === 2 ? "block" : "hidden"}>
                <StepDetails />
              </div>
              <div className={currentStep === 3 ? "block" : "hidden"}>
                <StepRequirements />
              </div>
              <div className={currentStep === 4 ? "block" : "hidden"}>
                <StepReview />
              </div>

              {currentStep === 4 && <fieldset className="mt-8 space-y-3 rounded-xl border border-[#d9e3ea] bg-[#f7f9fb] p-5">
                <legend className="px-2 text-sm font-semibold text-[#163B5C]">Publication</legend>
                <label className="mr-5 inline-flex items-center gap-2 text-sm text-slate-700"><input type="radio" name="publication" value="published" checked={publication==="published"} onChange={()=>setPublication("published")}/> Publish immediately</label>
                <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="radio" name="publication" value="scheduled" checked={publication==="scheduled"} onChange={()=>setPublication("scheduled")}/> Schedule publication</label>
                {publication === "scheduled" && <label className="block text-sm text-slate-700">Publish on
                  <input type="datetime-local" required className="mt-1 block w-full max-w-xs rounded-lg border border-slate-300 bg-white p-2" value={publishAt} onChange={e=>setPublishAt(e.target.value)}/>
                  <span className="mt-1 block text-xs text-slate-500">The Phase 4 scheduler must be configured on the backend for automatic publication.</span></label>}
              </fieldset>}
              {/* Navigation */}
              <div className="mt-16 flex flex-col-reverse gap-3 border-t border-[#163B5C]/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="h-12 rounded-2xl px-6 font-black text-[#516C83] disabled:opacity-0"
                >
                  <ArrowLeft className="mr-3 h-5 w-5" /> Previous Step
                </Button>

                <Button type="button" variant="outline" disabled={isLoading || isUpdating || isLoadingJob || jobLoadError} onClick={() => void saveDraft()} className="h-12 rounded-xl border-[#163B5C]/20 px-5 text-[#163B5C]">Save draft</Button>
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="h-12 rounded-2xl bg-[#163B5C] px-8 font-black text-white shadow-xl shadow-[#163B5C]/20 transition-all hover:-translate-y-0.5 hover:bg-[#516C83]"
                  >
                    Next Step <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || isUpdating || isLoadingJob || jobLoadError}
                    className="h-12 rounded-2xl bg-gradient-to-r from-[#163B5C] to-[#516C83] px-10 font-black text-white shadow-xl shadow-[#163B5C]/20 transition-all hover:-translate-y-0.5 hover:from-[#0C2C48] hover:to-[#3b5a71]"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-3 h-5 w-5" />
                    )}
                    {publication === "scheduled" ? "Schedule Opportunity" : "Publish Opportunity"}
                  </Button>
                )}
              </div>
            </Card>
          </form>
        </FormProvider>
      </div>
    </RecruiterLayout>
  );
};

export default CreateJobPage;
