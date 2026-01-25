"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card } from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Upload,
  X,
  DollarSign,
  FileText,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Zap,
  TrendingUp,
} from "lucide-react";

interface JobApplicationDialogProps {
  jobTitle: string;
  onApply: (resume: File | null, paymentAmount: number) => void;
}

const boostOptions = [
  { amount: 0, label: "Free", description: "Standard visibility" },
  { amount: 10, label: "$10", description: "2x visibility boost" },
  { amount: 25, label: "$25", description: "5x visibility boost", popular: true },
  { amount: 50, label: "$50", description: "10x visibility boost" },
];

const JobApplicationDialog = ({
  jobTitle,
  onApply,
}: JobApplicationDialogProps) => {
  const [resume, setResume] = useState<File | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setResume(file);
      } else {
        alert("Please upload a PDF or Word document");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.type.includes("word"))) {
      setResume(file);
    }
  };

  const handleRemoveFile = () => {
    setResume(null);
  };

  const handleSubmit = () => {
    onApply(resume, paymentAmount);
    setResume(null);
    setPaymentAmount(0);
    setIsDialogOpen(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full h-12 bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
          size="lg"
        >
          Apply Now
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-white border-none rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#234C6A]">
            Apply for {jobTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Resume Upload Section */}
          <div className="space-y-3">
            <Label className="text-[#234C6A] font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Upload Your Resume
            </Label>

            {!resume ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  isDragging
                    ? "border-[#234C6A] bg-[#234C6A]/5"
                    : "border-[#234C6A]/30 hover:border-[#234C6A]/50 bg-[#E3E3E3]/30"
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-[#234C6A]/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-6 w-6 text-[#234C6A]" />
                </div>
                <p className="text-[#234C6A] font-medium mb-1">
                  Drag and drop your resume here
                </p>
                <p className="text-sm text-[#456882] mb-4">
                  or click to browse (PDF, DOC, DOCX)
                </p>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("resume")?.click()}
                  className="border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10 rounded-xl"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            ) : (
              <Card className="p-4 bg-green-50 border-green-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#234C6A] truncate max-w-[200px]">
                        {resume.name}
                      </p>
                      <p className="text-xs text-[#456882]">
                        {formatFileSize(resume.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Boost Application Section */}
          <div className="space-y-3">
            <Label className="text-[#234C6A] font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Boost Your Application (Optional)
            </Label>
            <p className="text-sm text-[#456882]">
              Stand out from other applicants and appear higher in the recruiter&apos;s list
            </p>

            <div className="grid grid-cols-2 gap-3">
              {boostOptions.map((option) => (
                <button
                  key={option.amount}
                  type="button"
                  onClick={() => setPaymentAmount(option.amount)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                    paymentAmount === option.amount
                      ? "border-[#234C6A] bg-[#234C6A]/5"
                      : "border-[#234C6A]/20 hover:border-[#234C6A]/40"
                  }`}
                >
                  {option.popular && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-[#234C6A] to-[#456882] text-white text-xs font-semibold rounded-full flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Popular
                    </span>
                  )}
                  <p className="font-bold text-[#234C6A]">{option.label}</p>
                  <p className="text-xs text-[#456882]">{option.description}</p>
                  {paymentAmount === option.amount && (
                    <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-[#234C6A]" />
                  )}
                </button>
              ))}
            </div>

            {paymentAmount > 0 && (
              <div className="flex items-center gap-2 p-3 bg-[#234C6A]/5 rounded-xl">
                <TrendingUp className="h-4 w-4 text-[#234C6A]" />
                <span className="text-sm text-[#234C6A]">
                  Your application will be prioritized with a ${paymentAmount} boost
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-[#E3E3E3]">
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-[#234C6A]/30 text-[#234C6A] hover:bg-[#234C6A]/10 rounded-xl h-12"
            onClick={() => setIsDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white rounded-xl h-12 font-semibold"
            onClick={handleSubmit}
            disabled={!resume}
          >
            Submit Application
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationDialog;
