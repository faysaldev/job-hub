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

// ─── Shared Badge ─────────────────────────────────────────────────────────────

const Badge = memo(
  ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${className}`}
    >
      {children}
    </div>
  ),
);
Badge.displayName = "Badge";

// ─── Shared ListManager ───────────────────────────────────────────────────────

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
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleAdd();
        }
      },
      [handleAdd],
    );

    return (
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900">
          {label}
        </label>
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            className="h-9 rounded-xl border border-[#eaecf0] bg-white text-xs font-medium focus:border-black focus:ring-1 focus:ring-black"
          />
          <Button
            type="button"
            onClick={handleAdd}
            className="h-9 w-9 rounded-xl bg-black p-0 hover:bg-neutral-800 text-white shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {variant === "badge" ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {items?.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200/60 bg-[#f3f4f6] px-2.5 py-1 text-xs font-medium text-neutral-700"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="space-y-1.5 pt-1">
            {items?.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="group flex items-center gap-2.5 rounded-xl border border-neutral-100 bg-[#f8fafc] p-2.5"
              >
                {Icon && <Icon className="h-3.5 w-3.5 text-neutral-400 shrink-0" />}
                <span className="flex-1 text-xs font-medium text-neutral-800">
                  {item}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="h-3.5 w-3.5" />
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
  const watchedCategory = watch("category");

  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900">
          <Sparkles className="h-3.5 w-3.5 text-neutral-500" /> Job Title *
        </label>
        <Input
          {...register("title", { required: "Title is required" })}
          placeholder="e.g. Senior Frontend Architect"
          className="h-10 rounded-xl border border-[#eaecf0] bg-white px-3.5 text-xs sm:text-sm font-medium focus:border-black focus:ring-1 focus:ring-black"
        />
        {errors.title && (
          <p className="ml-1 text-[11px] font-semibold text-red-500">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            Category *
          </label>
          <Select
            value={watch("category") || undefined}
            onValueChange={(val) => {
              setValue("category", val, { shouldValidate: true });
              setValue("subcategory", "", { shouldValidate: true });
            }}
          >
            <SelectTrigger className="h-10 rounded-xl border border-[#eaecf0] bg-white px-3 text-xs font-medium">
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-neutral-200 p-1 shadow-md">
              {jobCategories.map((cat) => (
                <SelectItem
                  key={cat.id}
                  value={cat.id}
                  className="rounded-lg text-xs"
                >
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            Subcategory *
          </label>
          <Select
            value={watch("subcategory") || undefined}
            disabled={!watchedCategory}
            onValueChange={(val) =>
              setValue("subcategory", val, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-10 rounded-xl border border-[#eaecf0] bg-white px-3 text-xs font-medium">
              <SelectValue placeholder="Specialization" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-neutral-200 p-1 shadow-md">
              {jobCategories
                .find((c) => c.id === watchedCategory)
                ?.subcategories.map((sub) => (
                  <SelectItem
                    key={sub.id}
                    value={sub.id}
                    className="rounded-lg text-xs"
                  >
                    {sub.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            Work Arrangement *
          </label>
          <Select
            value={watch("locationType") || "onsite"}
            onValueChange={(val) => setValue("locationType", val, { shouldValidate: true })}
          >
            <SelectTrigger className="h-10 rounded-xl border border-[#eaecf0] bg-white px-3 text-xs font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-neutral-200 p-1 shadow-md">
              <SelectItem value="onsite" className="rounded-lg text-xs">
                On-site
              </SelectItem>
              <SelectItem value="remote" className="rounded-lg text-xs">
                Remote
              </SelectItem>
              <SelectItem value="hybrid" className="rounded-lg text-xs">
                Hybrid
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            Job Type *
          </label>
          <Select
            value={watch("type") || "full-time"}
            onValueChange={(val) => setValue("type", val, { shouldValidate: true })}
          >
            <SelectTrigger className="h-10 rounded-xl border border-[#eaecf0] bg-white px-3 text-xs font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-neutral-200 p-1 shadow-md">
              <SelectItem value="full-time" className="rounded-lg text-xs">
                Full-Time
              </SelectItem>
              <SelectItem value="part-time" className="rounded-lg text-xs">
                Part-Time
              </SelectItem>
              <SelectItem value="contract" className="rounded-lg text-xs">
                Contract
              </SelectItem>
              <SelectItem value="freelance" className="rounded-lg text-xs">
                Freelance
              </SelectItem>
              <SelectItem value="internship" className="rounded-lg text-xs">
                Internship
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
          Primary Location *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            {...register("location", { required: "Location is required" })}
            placeholder="e.g. San Francisco, CA or Remote"
            className="h-10 rounded-xl border border-[#eaecf0] bg-white pl-9 text-xs sm:text-sm font-medium focus:border-black focus:ring-1 focus:ring-black"
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
    <div className="animate-in fade-in space-y-6 duration-300">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            Experience Level *
          </label>
          <Select
            value={watch("experienceLevel") || "entry"}
            onValueChange={(val) => setValue("experienceLevel", val, { shouldValidate: true })}
          >
            <SelectTrigger className="h-10 rounded-xl border border-[#eaecf0] bg-white px-3 text-xs font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-neutral-200 p-1 shadow-md">
              <SelectItem value="entry" className="rounded-lg text-xs">
                Entry Level (0-2y)
              </SelectItem>
              <SelectItem value="junior" className="rounded-lg text-xs">
                Junior (2-4y)
              </SelectItem>
              <SelectItem value="mid" className="rounded-lg text-xs">
                Mid Level (4-6y)
              </SelectItem>
              <SelectItem value="senior" className="rounded-lg text-xs">
                Senior (6-10y)
              </SelectItem>
              <SelectItem value="lead" className="rounded-lg text-xs">
                Lead/Principal (10y+)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            Open Positions *
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              type="number"
              {...register("positions", { required: true, min: 1 })}
              className="h-10 rounded-xl border border-[#eaecf0] bg-white pl-9 text-xs sm:text-sm font-medium focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
          Compensation Range (USD)
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              type="number"
              {...register("salaryMin", { required: true })}
              placeholder="Min"
              className="h-10 rounded-xl border border-[#eaecf0] bg-white pl-9 text-xs sm:text-sm font-medium focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              type="number"
              {...register("salaryMax", { required: true })}
              placeholder="Max"
              className="h-10 rounded-xl border border-[#eaecf0] bg-white pl-9 text-xs sm:text-sm font-medium focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>
          <Select
            value={watch("salaryPeriod") || "yearly"}
            onValueChange={(val) => setValue("salaryPeriod", val, { shouldValidate: true })}
          >
            <SelectTrigger className="h-10 rounded-xl border border-[#eaecf0] bg-white px-3 text-xs font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-neutral-200 p-1 shadow-md">
              <SelectItem value="hourly" className="rounded-lg text-xs">
                per hour
              </SelectItem>
              <SelectItem value="monthly" className="rounded-lg text-xs">
                per month
              </SelectItem>
              <SelectItem value="yearly" className="rounded-lg text-xs">
                per year
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
          Application Deadline *
        </label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            type="date"
            {...register("applicationDeadline", { required: true })}
            className="h-10 rounded-xl border border-[#eaecf0] bg-white pl-9 text-xs sm:text-sm font-medium focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
          Role Description *
        </label>
        <Textarea
          {...register("description", { required: true })}
          placeholder="Describe the candidate profile, mission, team context, and role scope..."
          className="min-h-[160px] resize-none rounded-xl border border-[#eaecf0] bg-white p-3.5 text-xs sm:text-sm font-medium leading-relaxed focus:border-black focus:ring-1 focus:ring-black"
        />
      </div>
    </div>
  );
});
StepDetails.displayName = "StepDetails";

// ─── Step 3: Requirements ─────────────────────────────────────────────────────

const StepRequirements = memo(() => (
  <div className="animate-in fade-in space-y-6 duration-300">
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ListManager
        name="requirements"
        label="Key Requirements"
        placeholder="e.g. 4+ years of React / Next.js experience"
        icon={CheckCircle}
      />
      <ListManager
        name="responsibilities"
        label="Main Responsibilities"
        placeholder="e.g. Own product engineering for candidate features"
        icon={FileText}
      />
    </div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ListManager
        name="skills"
        label="Technical Skills"
        placeholder="e.g. TypeScript, Tailwind CSS, GraphQL"
        variant="badge"
      />
      <ListManager
        name="benefits"
        label="Benefits & Perks"
        placeholder="e.g. Health coverage, flexible stipend, remote work"
        icon={Sparkles}
      />
    </div>
  </div>
));
StepRequirements.displayName = "StepRequirements";

// ─── Step 4: Review ───────────────────────────────────────────────────────────

const StepReview = memo(() => {
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
    <div className="animate-in fade-in space-y-6 duration-300">
      {/* Review Hero Card */}
      <div className="rounded-2xl bg-black border border-neutral-800 p-6 text-white shadow-xs">
        <div className="space-y-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {title || "Untitled Position"}
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-neutral-800 border border-neutral-700 px-2.5 py-0.5 text-[11px] font-medium text-neutral-200 capitalize">
                  {type}
                </span>
                <span className="rounded-full bg-neutral-800 border border-neutral-700 px-2.5 py-0.5 text-[11px] font-medium text-neutral-200 capitalize">
                  {experienceLevel}
                </span>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Compensation
              </p>
              <p className="text-xl font-bold text-white">
                ${parseInt(salaryMin || "0").toLocaleString()} - $
                {parseInt(salaryMax || "0").toLocaleString()}
              </p>
              <p className="text-xs text-neutral-400">
                per {(salaryPeriod || "year").replace("ly", "")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 border-t border-neutral-800 pt-4 text-xs text-neutral-300">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-neutral-400" />
              <span>
                {location} ({locationType})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-neutral-400" />
              <span>
                {positions} Opening{Number(positions) !== 1 ? "s" : ""}
              </span>
            </div>
            {applicationDeadline && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-neutral-400" />
                <span>Deadline: {applicationDeadline}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            Description
          </h4>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        </div>

        <div className="space-y-4">
          {requirements && requirements.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Requirements
              </h4>
              <div className="space-y-1.5">
                {requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                    <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills && skills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Required Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-[#f3f4f6] text-neutral-700 border border-neutral-200/50 px-2 py-0.5 text-[11px] font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
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
    <div className="relative mb-6 rounded-2xl border border-[#eaecf0] bg-white p-4 sm:p-5 shadow-xs">
      <div className="absolute left-6 right-6 top-[2.25rem] h-0.5 bg-neutral-100" />
      <div
        className="absolute left-6 top-[2.25rem] h-0.5 bg-black transition-all duration-300"
        style={{ width: `calc((100% - 3rem) * ${progressRatio})` }}
      />
      <div className="relative flex justify-between">
        {STEPS.map((step) => {
          const active = currentStep >= step.number;
          return (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`z-10 flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 text-xs font-bold ${
                  active
                    ? "bg-black text-white shadow-xs"
                    : "border border-neutral-200 bg-white text-neutral-400"
                }`}
              >
                <step.icon className="h-4 w-4" />
              </div>
              <span
                className={`mt-2 hidden text-[10px] font-bold uppercase tracking-wider sm:block ${
                  active ? "text-neutral-900" : "text-neutral-400"
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
      <div className="mx-auto max-w-5xl space-y-6 pb-16">
        {/* Pitch-Black Hero Header */}
        <section className="relative overflow-hidden rounded-2xl bg-black p-6 sm:p-8 text-white border border-neutral-800 shadow-xs">
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-semibold text-neutral-300">
                <Shield className="h-3.5 w-3.5 text-neutral-400" />
                <span>Opportunity Builder</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                {jobId ? "Edit Opportunity" : "Create Opportunity"}
              </h1>
              <p className="mt-1 max-w-2xl text-xs sm:text-sm text-neutral-400">
                Craft a comprehensive role specification, compensation, and required skill set.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-row">
              <Button
                className="h-9 rounded-xl bg-white px-4 text-xs font-bold uppercase tracking-wider text-black hover:bg-neutral-100"
                onClick={() => router.push("/recruiter/jobs")}
              >
                <Briefcase className="mr-1.5 h-3.5 w-3.5" />
                View Jobs
              </Button>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="h-9 rounded-xl border-neutral-700 bg-neutral-900 px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800"
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Back
              </Button>
            </div>
          </div>
        </section>

        {jobLoadError && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 font-medium">
            Unable to load this job for editing. Check your company permissions.
          </p>
        )}
        {isLoadingJob && (
          <div className="h-16 animate-pulse rounded-xl bg-neutral-100" aria-label="Loading job" />
        )}

        <ProgressBar currentStep={currentStep} />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="rounded-2xl border border-[#eaecf0] bg-white p-5 sm:p-7 shadow-xs">
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

              {currentStep === 4 && (
                <fieldset className="mt-6 space-y-2.5 rounded-xl border border-neutral-200 bg-[#f8fafc] p-4">
                  <legend className="px-1 text-xs font-bold uppercase tracking-wider text-neutral-900">Publication</legend>
                  <label className="mr-4 inline-flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                    <input
                      type="radio"
                      name="publication"
                      value="published"
                      checked={publication === "published"}
                      onChange={() => setPublication("published")}
                      className="accent-black"
                    />
                    Publish immediately
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                    <input
                      type="radio"
                      name="publication"
                      value="scheduled"
                      checked={publication === "scheduled"}
                      onChange={() => setPublication("scheduled")}
                      className="accent-black"
                    />
                    Schedule publication
                  </label>
                  {publication === "scheduled" && (
                    <label className="block text-xs text-neutral-700 pt-2">
                      Publish on
                      <input
                        type="datetime-local"
                        required
                        className="mt-1 block w-full max-w-xs rounded-xl border border-neutral-300 bg-white p-2 text-xs"
                        value={publishAt}
                        onChange={(e) => setPublishAt(e.target.value)}
                      />
                    </label>
                  )}
                </fieldset>
              )}

              {/* Navigation Footer */}
              <div className="mt-8 flex flex-col-reverse gap-2.5 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="h-9 px-4 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-black disabled:opacity-0"
                >
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Previous Step
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading || isUpdating || isLoadingJob || jobLoadError}
                    onClick={() => void saveDraft()}
                    className="h-9 rounded-xl border-neutral-300 px-4 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50"
                  >
                    Save Draft
                  </Button>
                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="h-9 rounded-xl bg-black px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800"
                    >
                      Next Step <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading || isUpdating || isLoadingJob || jobLoadError}
                      className="h-9 rounded-xl bg-black px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800"
                    >
                      {isLoading ? (
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                      )}
                      {publication === "scheduled" ? "Schedule Opportunity" : "Publish Opportunity"}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </form>
        </FormProvider>
      </div>
    </RecruiterLayout>
  );
};

export default CreateJobPage;
