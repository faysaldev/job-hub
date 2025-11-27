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
import { Upload, X } from "lucide-react";

interface JobApplicationDialogProps {
  jobTitle: string;
  onApply: (resume: File | null) => void;
}

const JobApplicationDialog = ({
  jobTitle,
  onApply,
}: JobApplicationDialogProps) => {
  const [resume, setResume] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file type
      if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setResume(file);
      } else {
        alert("Please upload a PDF or Word document");
      }
    }
  };

  const handleRemoveFile = () => {
    setResume(null);
  };

  const handleSubmit = () => {
    onApply(resume);
    setResume(null);
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
          size="lg"
        >
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white border-[#456882]/30">
        <DialogHeader>
          <DialogTitle className="text-[#234C6A]">
            Apply for {jobTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resume" className="text-[#234C6A]">
                Upload Resume
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="border-[#234C6A]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="border-[#234C6A] text-[#234C6A]"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {resume && (
              <Card className="p-4 border-[#456882]/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#234C6A]/10 rounded-lg">
                      <Upload className="h-4 w-4 text-[#234C6A]" />
                    </div>
                    <span className="text-sm font-medium text-[#234C6A]">
                      {resume.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    className="text-[#234C6A]"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10"
            onClick={() => setIsDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
            onClick={handleSubmit}
            disabled={!resume}
          >
            Submit Application
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationDialog;
