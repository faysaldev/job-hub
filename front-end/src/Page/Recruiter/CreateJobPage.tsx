"use client";

import { useState, useRef, useCallback, memo } from "react";
import { useForm, FormProvider, useWatch, useFormContext } from "react-hook-form";
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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { jobCategories } from "@/src/lib/jobCategories";
import { useCreateJobMutation } from "@/src/redux/features/jobs/jobsApi";
import { toast } from "sonner";
import { Job } from "@/src/types";

// Types matching the user's specific requirement
type CreateJobFormValues = {
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

// --- Sub-components for better performance and clean code ---

const ListManager = memo(({ 
  name, 
  label, 
  placeholder, 
  icon: Icon,
  variant = "default" 
}: { 
  name: "requirements" | "responsibilities" | "benefits" | "skills", 
  label: string, 
  placeholder: string,
  icon?: any,
  variant?: "default" | "badge"
}) => {
  const { setValue, getValues } = useFormContext<CreateJobFormValues>();
  const items = useWatch({ name });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = useCallback(() => {
    const val = inputRef.current?.value.trim();
    if (val) {
      const current = getValues(name) || [];
      if (!current.includes(val)) {
        setValue(name, [...current, val], { shouldDirty: true });
        if (inputRef.current) inputRef.current.value = "";
      }
    }
  }, [getValues, name, setValue]);

  const handleRemove = useCallback((index: number) => {
    const current = getValues(name) || [];
    setValue(name, current.filter((_, i) => i !== index), { shouldDirty: true });
  }, [getValues, name, setValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-[#234C6A]">{label}</label>
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="border-[#E3E3E3] focus:border-[#234C6A] h-11"
        />
        <Button
          type="button"
          onClick={handleAdd}
          className="bg-[#234C6A] hover:bg-[#456882] h-11 w-11 p-0 rounded-xl"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      
      {variant === "badge" ? (
        <div className="flex flex-wrap gap-2">
          {items?.map((item: string, index: number) => (
            <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#234C6A]/10 text-[#234C6A] rounded-xl text-sm font-semibold border border-[#234C6A]/5">
              {item}
              <button type="button" onClick={() => handleRemove(index)} className="hover:text-red-200 transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {items?.map((item: string, index: number) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group animate-in fade-in slide-in-from-left-2">
              {Icon && <Icon className="h-4 w-4 text-[#456882]" />}
              <span className="flex-1 text-sm font-medium text-[#234C6A]">{item}</span>
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
});

ListManager.displayName = "ListManager";

// --- Main Page Component ---

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

  const { register, handleSubmit, watch, setValue, formState: { errors } } = methods;
  const watchedCategory = watch("category");
  const watchedValues = watch();

  if (!user) return null;

  const steps = [
    { number: 1, title: "Basic Info", icon: Briefcase },
    { number: 2, title: "Details", icon: FileText },
    { number: 3, title: "Requirements", icon: GraduationCap },
    { number: 4, title: "Review", icon: CheckCircle },
  ];

  const onSubmit = async (data: CreateJobFormValues) => {
    try {
      // Transform data to match Job type (convert strings to numbers)
      const transformedData = {
        ...data,
        salaryMin: Number(data.salaryMin),
        salaryMax: Number(data.salaryMax),
        positions: Number(data.positions),
        locationType: data.locationType, // Ensure this is passed
      };

      await createJob(transformedData as Job).unwrap();
      toast.success("Job posted successfully!");
      router.push("/recruiter/jobs");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create job");
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <RecruiterLayout>
      <div className="max-w-5xl mx-auto pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white shadow-2xl rotate-3">
              <Plus className="h-8 w-8 -rotate-3" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#234C6A] tracking-tight">Create Opportunity</h1>
              <p className="text-[#456882] font-medium">Find your next great team member</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="rounded-2xl border-[#234C6A]/10 text-[#456882] hover:bg-white hover:shadow-md transition-all self-start md:self-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-12 px-4">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#234C6A] to-[#456882] -translate-y-1/2 rounded-full transition-all duration-500" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
          <div className="relative flex justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 z-10 ${
                    currentStep >= step.number
                      ? "bg-white shadow-xl text-[#234C6A] border-2 border-[#234C6A]"
                      : "bg-white border-2 border-gray-100 text-gray-300"
                  }`}
                >
                  <step.icon className={`h-5 w-5 ${currentStep >= step.number ? "animate-pulse" : ""}`} />
                </div>
                <span className={`mt-3 text-xs font-bold uppercase tracking-widest ${currentStep >= step.number ? "text-[#234C6A]" : "text-gray-300"}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="p-8 md:p-12 border-none bg-white shadow-2xl rounded-[2.5rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#234C6A]/5 to-transparent rounded-full -mr-32 -mt-32" />
              
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#234C6A] flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-[#456882]" /> Job Title *
                        </label>
                        <Input
                          {...register("title", { required: "Title is required" })}
                          placeholder="e.g. Senior Frontend Architect"
                          className="h-14 rounded-2xl border-[#E3E3E3] focus:border-[#234C6A] focus:ring-4 focus:ring-[#234C6A]/5 font-medium px-6 text-lg"
                        />
                        {errors.title && <p className="text-xs text-red-500 font-bold ml-2">{errors.title.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#234C6A]">Category *</label>
                        <Select onValueChange={(val) => setValue("category", val, { shouldValidate: true })}>
                          <SelectTrigger className="h-14 rounded-2xl border-[#E3E3E3] font-medium px-6">
                            <SelectValue placeholder="Select Industry" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl shadow-2xl border-none p-2">
                            {jobCategories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id} className="rounded-xl focus:bg-[#234C6A]/5">{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#234C6A]">Subcategory *</label>
                        <Select 
                          disabled={!watchedCategory}
                          onValueChange={(val) => setValue("subcategory", val, { shouldValidate: true })}
                        >
                          <SelectTrigger className="h-14 rounded-2xl border-[#E3E3E3] font-medium px-6">
                            <SelectValue placeholder="Specialization" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl shadow-2xl border-none p-2">
                            {jobCategories.find(c => c.id === watchedCategory)?.subcategories.map((sub) => (
                              <SelectItem key={sub.id} value={sub.id} className="rounded-xl focus:bg-[#234C6A]/5">{sub.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#234C6A]">Work Arrangement *</label>
                        <Select 
                          defaultValue="onsite"
                          onValueChange={(val) => setValue("locationType", val)}
                        >
                          <SelectTrigger className="h-14 rounded-2xl border-[#E3E3E3] font-medium px-6">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl shadow-2xl border-none p-2">
                            <SelectItem value="onsite" className="rounded-xl">On-site</SelectItem>
                            <SelectItem value="remote" className="rounded-xl">Remote</SelectItem>
                            <SelectItem value="hybrid" className="rounded-xl">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#234C6A]">Job Type *</label>
                        <Select 
                          defaultValue="full-time"
                          onValueChange={(val) => setValue("type", val)}
                        >
                          <SelectTrigger className="h-14 rounded-2xl border-[#E3E3E3] font-medium px-6">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl shadow-2xl border-none p-2">
                            <SelectItem value="full-time" className="rounded-xl">Full-Time</SelectItem>
                            <SelectItem value="part-time" className="rounded-xl">Part-Time</SelectItem>
                            <SelectItem value="contract" className="rounded-xl">Contract</SelectItem>
                            <SelectItem value="freelance" className="rounded-xl">Freelance</SelectItem>
                            <SelectItem value="internship" className="rounded-xl">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#234C6A]">Primary Location *</label>
                      <div className="relative group">
                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882] group-focus-within:text-[#234C6A] transition-colors" />
                        <Input
                          {...register("location", { required: "Location is required" })}
                          placeholder="e.g. San Francisco, CA or Remote"
                          className="h-14 rounded-2xl border-[#E3E3E3] pl-14 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Details */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#234C6A]">Experience Level *</label>
                      <Select 
                        defaultValue="entry"
                        onValueChange={(val) => setValue("experienceLevel", val)}
                      >
                        <SelectTrigger className="h-14 rounded-2xl border-[#E3E3E3] font-medium px-6">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl shadow-2xl border-none p-2">
                          <SelectItem value="entry" className="rounded-xl">Entry Level (0-2y)</SelectItem>
                          <SelectItem value="junior" className="rounded-xl">Junior (2-4y)</SelectItem>
                          <SelectItem value="mid" className="rounded-xl">Mid Level (4-6y)</SelectItem>
                          <SelectItem value="senior" className="rounded-xl">Senior (6-10y)</SelectItem>
                          <SelectItem value="lead" className="rounded-xl">Lead/Principal (10y+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#234C6A]">Open Positions *</label>
                      <div className="relative">
                        <Users className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
                        <Input
                          type="number"
                          {...register("positions", { required: true, min: 1 })}
                          className="h-14 rounded-2xl border-[#E3E3E3] pl-14 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#234C6A]">Compensation Package (USD)</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative">
                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
                        <Input
                          type="number"
                          {...register("salaryMin", { required: true })}
                          placeholder="Min"
                          className="h-14 rounded-2xl border-[#E3E3E3] pl-14 font-medium"
                        />
                      </div>
                      <div className="relative">
                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
                        <Input
                          type="number"
                          {...register("salaryMax", { required: true })}
                          placeholder="Max"
                          className="h-14 rounded-2xl border-[#E3E3E3] pl-14 font-medium"
                        />
                      </div>
                      <Select 
                        defaultValue="yearly"
                        onValueChange={(val) => setValue("salaryPeriod", val)}
                      >
                        <SelectTrigger className="h-14 rounded-2xl border-[#E3E3E3] font-medium px-6">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                          <SelectItem value="hourly" className="rounded-xl">per hour</SelectItem>
                          <SelectItem value="monthly" className="rounded-xl">per month</SelectItem>
                          <SelectItem value="yearly" className="rounded-xl">per year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#234C6A]">Application Deadline *</label>
                    <div className="relative">
                      <Clock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
                      <Input
                        type="date"
                        {...register("applicationDeadline", { required: true })}
                        className="h-14 rounded-2xl border-[#E3E3E3] pl-14 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#234C6A]">Role Description *</label>
                    <Textarea
                      {...register("description", { required: true })}
                      placeholder="Paint a picture of the ideal candidate and the impact they'll make..."
                      className="min-h-[250px] rounded-[2rem] border-[#E3E3E3] p-8 font-medium leading-relaxed resize-none focus:ring-[#234C6A]/5"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Requirements & Lists */}
              {currentStep === 3 && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="p-10 bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                    <div className="relative space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="text-4xl font-black">{watchedValues.title || "Untitled Position"}</h3>
                          <div className="flex flex-wrap gap-3">
                            <Badge className="bg-white/20 text-white border-none backdrop-blur-md rounded-lg">
                              {watchedValues.type}
                            </Badge>
                            <Badge className="bg-white/20 text-white border-none backdrop-blur-md rounded-lg">
                              {watchedValues.experienceLevel}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold opacity-70 uppercase tracking-widest">Compensation</p>
                          <p className="text-3xl font-black">
                            ${parseInt(watchedValues.salaryMin || "0").toLocaleString()} - ${parseInt(watchedValues.salaryMax || "0").toLocaleString()}
                          </p>
                          <p className="text-sm font-bold opacity-70">per {watchedValues.salaryPeriod.replace('ly', '')}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-8 pt-6 border-t border-white/10">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 opacity-70" />
                          <span className="font-bold">{watchedValues.location} ({watchedValues.locationType})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 opacity-70" />
                          <span className="font-bold">{watchedValues.positions} Openings</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 opacity-70" />
                          <span className="font-bold">Deadline: {watchedValues.applicationDeadline}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-4">
                    <div className="space-y-4">
                      <h4 className="text-lg font-black text-[#234C6A] flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-[#234C6A] rounded-full" /> Description
                      </h4>
                      <p className="text-[#456882] font-medium leading-relaxed whitespace-pre-wrap">
                        {watchedValues.description}
                      </p>
                    </div>
                    
                    <div className="space-y-10">
                      <div className="space-y-4">
                        <h4 className="text-lg font-black text-[#234C6A]">Requirements</h4>
                        <div className="space-y-2">
                          {watchedValues.requirements?.map((req, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                              <span className="text-[#456882] font-medium">{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-lg font-black text-[#234C6A]">Core Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {watchedValues.skills?.map((skill, i) => (
                            <Badge key={i} className="bg-[#234C6A]/5 text-[#234C6A] border-none font-bold rounded-lg px-4 py-1.5">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-16 pt-10 border-t border-gray-50">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="h-14 px-8 rounded-2xl font-bold text-[#456882] disabled:opacity-0"
                >
                  <ArrowLeft className="h-5 w-5 mr-3" /> Previous Step
                </Button>

                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="h-14 px-10 rounded-2xl bg-[#234C6A] hover:bg-[#456882] text-white font-black shadow-xl shadow-[#234C6A]/20 transition-all hover:-translate-y-1"
                  >
                    Next Component <ArrowRight className="h-5 w-5 ml-3" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-14 px-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black shadow-xl shadow-green-500/20 transition-all hover:scale-105"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : <CheckCircle className="h-5 w-5 mr-3" />}
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

// Helper components
const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${className}`}>
    {children}
  </div>
);

export default CreateJobPage;
