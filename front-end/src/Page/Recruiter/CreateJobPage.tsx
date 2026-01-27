"use client";

import { useState } from "react";
import { mockUser } from "@/src/components/common/Header";
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
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Plus,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  GraduationCap,
  Building2,
  FileText,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { jobCategories } from "@/src/lib/jobCategories";

interface JobFormData {
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
}

const CreateJobPage = () => {
  const user = mockUser;
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [newRequirement, setNewRequirement] = useState("");
  const [newResponsibility, setNewResponsibility] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newSkill, setNewSkill] = useState("");

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    category: "",
    subcategory: "",
    type: "",
    location: "",
    locationType: "",
    salaryMin: "",
    salaryMax: "",
    salaryPeriod: "yearly",
    experienceLevel: "",
    description: "",
    requirements: [],
    responsibilities: [],
    benefits: [],
    skills: [],
    applicationDeadline: "",
    positions: "1",
  });

  if (!user) return null;

  const jobTypes = [
    { id: "full-time", label: "Full Time" },
    { id: "part-time", label: "Part Time" },
    { id: "contract", label: "Contract" },
    { id: "freelance", label: "Freelance" },
    { id: "internship", label: "Internship" },
  ];

  const locationTypes = [
    { id: "onsite", label: "On-site" },
    { id: "remote", label: "Remote" },
    { id: "hybrid", label: "Hybrid" },
  ];

  const experienceLevels = [
    { id: "entry", label: "Entry Level (0-2 years)" },
    { id: "junior", label: "Junior (2-4 years)" },
    { id: "mid", label: "Mid Level (4-6 years)" },
    { id: "senior", label: "Senior (6-10 years)" },
    { id: "lead", label: "Lead/Principal (10+ years)" },
  ];

  const selectedCategory = jobCategories.find(c => c.id === formData.category);

  const handleInputChange = (field: keyof JobFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = (field: "requirements" | "responsibilities" | "benefits" | "skills", value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
    }
  };

  const removeItem = (field: "requirements" | "responsibilities" | "benefits" | "skills", index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    // In a real app, this would submit to an API
    console.log("Job data:", formData);
    router.push("/recruiter/jobs");
  };

  const steps = [
    { number: 1, title: "Basic Info", icon: Briefcase },
    { number: 2, title: "Details", icon: FileText },
    { number: 3, title: "Requirements", icon: GraduationCap },
    { number: 4, title: "Review", icon: CheckCircle },
  ];

  return (
    <RecruiterLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-[#456882] hover:text-[#234C6A] hover:bg-[#234C6A]/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white shadow-lg">
              <Plus className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#234C6A]">Create New Job Posting</h1>
              <p className="text-[#456882]">Fill in the details to post a new job opening</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentStep >= step.number
                        ? "bg-gradient-to-br from-[#234C6A] to-[#456882] text-white shadow-lg"
                        : "bg-[#E3E3E3] text-[#456882]"
                    }`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className={`mt-2 text-xs font-medium ${currentStep >= step.number ? "text-[#234C6A]" : "text-[#456882]"}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded ${currentStep > step.number ? "bg-[#234C6A]" : "bg-[#E3E3E3]"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="p-6 md:p-8 border-none bg-white shadow-lg rounded-2xl">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#234C6A] mb-2">Job Title *</label>
                <Input
                  placeholder="e.g., Senior Frontend Developer"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="border-[#E3E3E3] focus:border-[#234C6A] focus:ring-[#234C6A]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#234C6A] mb-2">Category *</label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="border-[#E3E3E3] focus:border-[#234C6A]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#234C6A] mb-2">Subcategory</label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) => handleInputChange("subcategory", value)}
                    disabled={!selectedCategory}
                  >
                    <SelectTrigger className="border-[#E3E3E3] focus:border-[#234C6A]">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory?.subcategories.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#234C6A] mb-2">Job Type *</label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger className="border-[#E3E3E3] focus:border-[#234C6A]">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#234C6A] mb-2">Work Location Type *</label>
                  <Select value={formData.locationType} onValueChange={(value) => handleInputChange("locationType", value)}>
                    <SelectTrigger className="border-[#E3E3E3] focus:border-[#234C6A]">
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#234C6A] mb-2">Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
                  <Input
                    placeholder="e.g., New York, NY or Remote"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="pl-10 border-[#E3E3E3] focus:border-[#234C6A] focus:ring-[#234C6A]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#234C6A] mb-2">Experience Level *</label>
                <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange("experienceLevel", value)}>
                  <SelectTrigger className="border-[#E3E3E3] focus:border-[#234C6A]">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level.id} value={level.id}>{level.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#234C6A] mb-2">Salary Range</label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
                    <Input
                      type="number"
                      placeholder="Min"
                      value={formData.salaryMin}
                      onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                      className="pl-10 border-[#E3E3E3] focus:border-[#234C6A] focus:ring-[#234C6A]"
                    />
                  </div>
                  <span className="text-[#456882]">to</span>
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={formData.salaryMax}
                      onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                      className="pl-10 border-[#E3E3E3] focus:border-[#234C6A] focus:ring-[#234C6A]"
                    />
                  </div>
                  <Select value={formData.salaryPeriod} onValueChange={(value) => handleInputChange("salaryPeriod", value)}>
                    <SelectTrigger className="w-32 border-[#E3E3E3] focus:border-[#234C6A]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#234C6A] mb-2">Number of Positions</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
                    <Input
                      type="number"
                      min="1"
                      value={formData.positions}
                      onChange={(e) => handleInputChange("positions", e.target.value)}
                      className="pl-10 border-[#E3E3E3] focus:border-[#234C6A] focus:ring-[#234C6A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#234C6A] mb-2">Application Deadline</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
                    <Input
                      type="date"
                      value={formData.applicationDeadline}
                      onChange={(e) => handleInputChange("applicationDeadline", e.target.value)}
                      className="pl-10 border-[#E3E3E3] focus:border-[#234C6A] focus:ring-[#234C6A]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#234C6A] mb-2">Job Description *</label>
                <Textarea
                  placeholder="Describe the role, team, and what makes this opportunity exciting..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="min-h-[200px] border-[#E3E3E3] focus:border-[#234C6A] focus:ring-[#234C6A]"
                />
              </div>
            </div>
          )}

          {/* Step 3: Requirements & Benefits */}
          {currentStep === 3 && (
            <div className="space-y-8">
              {/* Requirements */}
              <div>
                <label className="block text-sm font-semibold text-[#234C6A] mb-2">Requirements</label>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Add a requirement..."
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addItem("requirements", newRequirement);
                        setNewRequirement("");
                      }
                    }}
                    className="border-[#E3E3E3] focus:border-[#234C6A]"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      addItem("requirements", newRequirement);
                      setNewRequirement("");
                    }}
                    className="bg-[#234C6A] hover:bg-[#234C6A]/90"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-[#E3E3E3]/50 rounded-lg">
                      <span className="flex-1 text-sm text-[#234C6A]">{req}</span>
                      <button onClick={() => removeItem("requirements", index)} className="text-[#456882] hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-semibold text-[#234C6A] mb-2">Responsibilities</label>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Add a responsibility..."
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addItem("responsibilities", newResponsibility);
                        setNewResponsibility("");
                      }
                    }}
                    className="border-[#E3E3E3] focus:border-[#234C6A]"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      addItem("responsibilities", newResponsibility);
                      setNewResponsibility("");
                    }}
                    className="bg-[#234C6A] hover:bg-[#234C6A]/90"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.responsibilities.map((resp, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-[#E3E3E3]/50 rounded-lg">
                      <span className="flex-1 text-sm text-[#234C6A]">{resp}</span>
                      <button onClick={() => removeItem("responsibilities", index)} className="text-[#456882] hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-semibold text-[#234C6A] mb-2">Required Skills</label>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addItem("skills", newSkill);
                        setNewSkill("");
                      }
                    }}
                    className="border-[#E3E3E3] focus:border-[#234C6A]"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      addItem("skills", newSkill);
                      setNewSkill("");
                    }}
                    className="bg-[#234C6A] hover:bg-[#234C6A]/90"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-[#234C6A]/10 text-[#234C6A] rounded-full text-sm">
                      {skill}
                      <button onClick={() => removeItem("skills", index)} className="hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-semibold text-[#234C6A] mb-2">Benefits & Perks</label>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Add a benefit..."
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addItem("benefits", newBenefit);
                        setNewBenefit("");
                      }
                    }}
                    className="border-[#E3E3E3] focus:border-[#234C6A]"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      addItem("benefits", newBenefit);
                      setNewBenefit("");
                    }}
                    className="bg-[#234C6A] hover:bg-[#234C6A]/90"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <Sparkles className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="flex-1 text-sm text-[#234C6A]">{benefit}</span>
                      <button onClick={() => removeItem("benefits", index)} className="text-[#456882] hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#234C6A]/5 to-[#456882]/5 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-[#234C6A] mb-4">{formData.title || "Untitled Position"}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-[#456882]">Category</span>
                    <p className="font-semibold text-[#234C6A]">{jobCategories.find(c => c.id === formData.category)?.name || "-"}</p>
                  </div>
                  <div>
                    <span className="text-[#456882]">Type</span>
                    <p className="font-semibold text-[#234C6A]">{jobTypes.find(t => t.id === formData.type)?.label || "-"}</p>
                  </div>
                  <div>
                    <span className="text-[#456882]">Location</span>
                    <p className="font-semibold text-[#234C6A]">{formData.location || "-"}</p>
                  </div>
                  <div>
                    <span className="text-[#456882]">Experience</span>
                    <p className="font-semibold text-[#234C6A]">{experienceLevels.find(l => l.id === formData.experienceLevel)?.label || "-"}</p>
                  </div>
                </div>
                {formData.salaryMin && formData.salaryMax && (
                  <div className="mt-4 pt-4 border-t border-[#E3E3E3]">
                    <span className="text-[#456882]">Salary Range</span>
                    <p className="font-semibold text-[#234C6A]">
                      ${parseInt(formData.salaryMin).toLocaleString()} - ${parseInt(formData.salaryMax).toLocaleString()} / {formData.salaryPeriod}
                    </p>
                  </div>
                )}
              </div>

              {formData.description && (
                <div>
                  <h4 className="font-semibold text-[#234C6A] mb-2">Description</h4>
                  <p className="text-[#456882] whitespace-pre-wrap">{formData.description}</p>
                </div>
              )}

              {formData.requirements.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#234C6A] mb-2">Requirements</h4>
                  <ul className="list-disc list-inside space-y-1 text-[#456882]">
                    {formData.requirements.map((req, i) => <li key={i}>{req}</li>)}
                  </ul>
                </div>
              )}

              {formData.responsibilities.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#234C6A] mb-2">Responsibilities</h4>
                  <ul className="list-disc list-inside space-y-1 text-[#456882]">
                    {formData.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                  </ul>
                </div>
              )}

              {formData.skills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#234C6A] mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-[#234C6A]/10 text-[#234C6A] rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {formData.benefits.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#234C6A] mb-2">Benefits & Perks</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {formData.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-[#456882]">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-[#E3E3E3]">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 1}
              className="border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Publish Job
              </Button>
            )}
          </div>
        </Card>
      </div>
    </RecruiterLayout>
  );
};

export default CreateJobPage;
