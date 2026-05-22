"use client";

import { memo, useRef, useCallback, useState } from "react";
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
import { useCreateJobMutation } from "@/src/redux/features/jobs/jobsApi";
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
        <label className="block text-sm font-black text-[#234C6A]">
          {label}
        </label>
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            className="h-12 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] font-medium focus:border-[#234C6A]"
          />
          <Button
            type="button"
            onClick={handleAdd}
            className="h-12 w-12 rounded-2xl bg-[#234C6A] p-0 hover:bg-[#456882] text-white"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {variant === "badge" ? (
          <div className="flex flex-wrap gap-2">
            {items?.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#234C6A]/10 bg-[#234C6A]/5 px-3 py-1.5 text-sm font-black text-[#234C6A]"
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
                className="group flex items-center gap-3 rounded-2xl border border-[#234C6A]/10 bg-[#F8FAFC] p-3"
              >
                {Icon && <Icon className="h-4 w-4 text-[#456882] shrink-0" />}
                <span className="flex-1 text-sm font-semibold text-[#234C6A]">
                  {item}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-[#456882] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
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
        <label className="flex items-center gap-2 text-sm font-black text-[#234C6A]">
          <Sparkles className="h-4 w-4 text-[#456882]" /> Job Title *
        </label>
        <Input
          {...register("title", { required: "Title is required" })}
          placeholder="e.g. Senior Frontend Architect"
          className="h-14 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] px-6 text-lg font-medium focus:border-[#234C6A] focus:ring-4 focus:ring-[#234C6A]/5"
        />
        {errors.title && (
          <p className="ml-2 text-xs font-bold text-red-500">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-black text-[#234C6A]">
            Category *
          </label>
          <Select
            onValueChange={(val) =>
              setValue("category", val, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-14 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] px-6 font-medium">
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none p-2 shadow-2xl">
              {jobCategories.map((cat) => (
                <SelectItem
                  key={cat.id}
                  value={cat.id}
                  className="rounded-xl focus:bg-[#234C6A]/5"
                >
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black text-[#234C6A]">
            Subcategory *
          </label>
          <Select
            disabled={!watchedCategory}
            onValueChange={(val) =>
              setValue("subcategory", val, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-14 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] px-6 font-medium">
              <SelectValue placeholder="Specialization" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none p-2 shadow-2xl">
              {jobCategories
                .find((c) => c.id === watchedCategory)
                ?.subcategories.map((sub) => (
                  <SelectItem
                    key={sub.id}
                    value={sub.id}
                    className="rounded-xl focus:bg-[#234C6A]/5"
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
          <label className="text-sm font-black text-[#234C6A]">
            Work Arrangement *
          </label>
          <Select
            defaultValue="onsite"
            onValueChange={(val) => setValue("locationType", val)}
          >
            <SelectTrigger className="h-14 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] px-6 font-medium">
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
          <label className="text-sm font-black text-[#234C6A]">
            Job Type *
          </label>
          <Select
            defaultValue="full-time"
            onValueChange={(val) => setValue("type", val)}
          >
            <SelectTrigger className="h-14 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] px-6 font-medium">
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
        <label className="text-sm font-black text-[#234C6A]">
          Primary Location *
        </label>
        <div className="relative group">
          <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882] group-focus-within:text-[#234C6A] transition-colors" />
          <Input
            {...register("location", { required: "Location is required" })}
            placeholder="e.g. San Francisco, CA or Remote"
            className="h-14 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] pl-14 font-medium"
          />
        </div>
      </div>
    </div>
  );
});
StepBasicInfo.displayName = "StepBasicInfo";

// ─── Step 2: Details ──────────────────────────────────────────────────────────

const StepDetails = memo(() => {
  const { register, setValue } = useFormContext<CreateJobFormValues>();

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-black text-[#234C6A]">
            Experience Level *
          </label>
          <Select
            defaultValue="entry"
            onValueChange={(val) => setValue("experienceLevel", val)}
          >
            <SelectTrigger className="h-14 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] px-6 font-medium">
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
          <label className="text-sm font-black text-[#234C6A]">
            Open Positions *
          </label>
          <div className="relative">
            <Users className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
            <Input
              type="number"
              {...register("positions", { required: true, min: 1 })}
              className="h-14 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] pl-14 font-medium"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-black text-[#234C6A]">
          Compensation Package (USD)
        </label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative">
            <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
            <Input
              type="number"
              {...register("salaryMin", { required: true })}
              placeholder="Min"
              className="h-14 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] pl-14 font-medium"
            />
          </div>
          <div className="relative">
            <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
            <Input
              type="number"
              {...register("salaryMax", { required: true })}
              placeholder="Max"
              className="h-14 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] pl-14 font-medium"
            />
          </div>
          <Select
            defaultValue="yearly"
            onValueChange={(val) => setValue("salaryPeriod", val)}
          >
            <SelectTrigger className="h-14 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] px-6 font-medium">
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
        <label className="text-sm font-black text-[#234C6A]">
          Application Deadline *
        </label>
        <div className="relative">
          <Clock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
          <Input
            type="date"
            {...register("applicationDeadline", { required: true })}
            className="h-14 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] pl-14 font-medium"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-black text-[#234C6A]">
          Role Description *
        </label>
        <Textarea
          {...register("description", { required: true })}
          placeholder="Paint a picture of the ideal candidate and the impact they'll make..."
          className="min-h-[250px] resize-none rounded-3xl border-[#234C6A]/10 bg-[#F8FAFC] p-8 font-medium leading-relaxed"
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#234C6A] to-[#456882] p-8 text-white shadow-2xl shadow-[#234C6A]/20 md:p-10">
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
          <h4 className="flex items-center gap-2 text-lg font-black text-[#234C6A]">
            <div className="h-6 w-1.5 rounded-full bg-[#234C6A]" /> Description
          </h4>
          <p className="text-[#456882] font-medium leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <h4 className="text-lg font-black text-[#234C6A]">Requirements</h4>
            <div className="space-y-2">
              {requirements?.map((req, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <span className="text-[#456882] font-medium">{req}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-black text-[#234C6A]">Core Skills</h4>
            <div className="flex flex-wrap gap-2">
              {skills?.map((skill, i) => (
                <Badge
                  key={i}
                  className="bg-[#234C6A]/5 text-[#234C6A] border-none font-bold rounded-lg px-4 py-1.5"
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
    <div className="relative mb-10 rounded-3xl border border-[#234C6A]/10 bg-white/95 p-5 shadow-sm backdrop-blur md:mb-12 md:p-6">
      <div className="absolute left-6 right-6 top-[2.75rem] h-1 rounded-full bg-[#E3E3E3]" />
      <div
        className="absolute left-6 top-[2.75rem] h-1 rounded-full bg-gradient-to-r from-[#234C6A] to-[#456882] transition-all duration-500"
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
                    ? "border-2 border-[#234C6A] bg-white text-[#234C6A] shadow-xl shadow-[#234C6A]/10"
                    : "border-2 border-[#E3E3E3] bg-white text-[#456882]/30"
                }`}
              >
                <step.icon className="h-5 w-5" />
              </div>
              <span
                className={`mt-3 hidden text-xs font-black uppercase tracking-widest sm:block ${
                  active ? "text-[#234C6A]" : "text-[#456882]/35"
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

const CreateJobPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createJob, { isLoading }] = useCreateJobMutation();

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

  const nextStep = useCallback(
    () => setCurrentStep((p) => Math.min(p + 1, 4)),
    [],
  );
  const prevStep = useCallback(
    () => setCurrentStep((p) => Math.max(p - 1, 1)),
    [],
  );

  const onSubmit = useCallback(
    async (data: CreateJobFormValues) => {
      try {
        await createJob({
          ...data,
          salaryMin: data.salaryMin,
          salaryMax: data.salaryMax,
          positions: data.positions,
        } as unknown as Job).unwrap();
        toast.success("Job posted successfully!");
        router.push("/recruiter/jobs");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to create job");
      }
    },
    [createJob, router],
  );

  if (!user) return null;

  return (
    <RecruiterLayout>
      <div className="mx-auto max-w-6xl space-y-8 pb-20">
        <section className="relative overflow-hidden rounded-3xl bg-[#234C6A] p-7 text-white shadow-2xl shadow-[#234C6A]/20 md:p-9">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="relative z-10 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur-sm">
                <Shield className="h-4 w-4" />
                <span>Opportunity Builder</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                Create Opportunity
              </h1>
              <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-white/75">
                Build a polished job post with clear role details, compensation,
                requirements, and review-ready publishing.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button
                className="h-12 rounded-2xl bg-white px-6 font-black text-[#234C6A] hover:bg-[#E3E3E3]"
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
              className="rounded-3xl border border-[#234C6A]/10 bg-white/95 p-5 shadow-sm backdrop-blur"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#234C6A]/10 text-[#234C6A]">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black text-[#234C6A]">{item.value}</p>
              <p className="mt-1 text-xs font-black uppercase tracking-widest text-[#456882]">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-medium text-[#456882]/80">
                {item.detail}
              </p>
            </Card>
          ))}
        </div>

        <ProgressBar currentStep={currentStep} />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="relative overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 p-6 shadow-2xl shadow-[#234C6A]/10 backdrop-blur md:p-10 lg:p-12">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#234C6A] to-[#456882]" />

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

              {/* Navigation */}
              <div className="mt-16 flex flex-col-reverse gap-3 border-t border-[#234C6A]/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="h-12 rounded-2xl px-6 font-black text-[#456882] disabled:opacity-0"
                >
                  <ArrowLeft className="mr-3 h-5 w-5" /> Previous Step
                </Button>

                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="h-12 rounded-2xl bg-[#234C6A] px-8 font-black text-white shadow-xl shadow-[#234C6A]/20 transition-all hover:-translate-y-0.5 hover:bg-[#456882]"
                  >
                    Next Step <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 rounded-2xl bg-gradient-to-r from-[#234C6A] to-[#456882] px-10 font-black text-white shadow-xl shadow-[#234C6A]/20 transition-all hover:-translate-y-0.5 hover:from-[#1c405a] hover:to-[#3b5a71]"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-3 h-5 w-5" />
                    )}
                    Publish Opportunity
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
