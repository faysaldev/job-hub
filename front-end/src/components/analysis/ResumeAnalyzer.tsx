/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Target,
  Award,
  Clock,
  User,
  Briefcase,
  Globe
} from "lucide-react";
import { Progress } from "@/src/components/ui/progress";
import { Badge } from "@/src/components/ui/badge";

const ResumeAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<string | any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setResults(null);
    }
  };

  const analyzeResume = () => {
    if (!file) return;

    setAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setResults({
        score: 82,
        strengths: [
          {
            title: "Strong technical skills section",
            description: "Your technical skills are clearly outlined and relevant to the job market",
            category: "Skills"
          },
          {
            title: "Clear work experience descriptions",
            description: "Your work experiences are well-detailed with specific responsibilities",
            category: "Experience"
          },
          {
            title: "Quantifiable achievements included",
            description: "You've included metrics and numbers that demonstrate your impact",
            category: "Achievements"
          }
        ],
        improvements: [
          {
            title: "Add more action verbs",
            description: "Use more action verbs like 'managed', 'led', 'implemented' for stronger impact",
            category: "Writing"
          },
          {
            title: "Include certifications section",
            description: "Add a certifications section to enhance your professional credibility",
            category: "Structure"
          },
          {
            title: "Optimize for ATS keywords",
            description: "Add more industry-specific keywords for better ATS compatibility",
            category: "Optimization"
          }
        ],
        keywords: ["React", "TypeScript", "Leadership", "Problem Solving", "JavaScript", "Node.js", "Project Management", "Agile Methodologies"],
        atsCompatibility: 88,
        experience: 5,
        education: "Bachelor's Degree",
        location: "San Francisco, CA",
        targetRole: "Senior Frontend Developer",
        optimizationTips: [
          "Use 12-16pt font size for readability",
          "Keep margins between 0.5-1 inch",
          "Use standard fonts like Arial or Times New Roman for ATS compatibility"
        ]
      });
      setAnalyzing(false);
    }, 2500);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#234C6A] to-[#456882] bg-clip-text text-transparent">
            Advanced Resume Analyzer
          </h2>
          <p className="text-lg text-[#234C6A] max-w-2xl mx-auto">
            Upload your resume to get comprehensive feedback, keyword optimization, and actionable insights to improve your chances of landing interviews.
          </p>
        </div>

        <div className="space-y-8">
          <div className="border-2 border-dashed border-[#234C6A]/30 rounded-xl p-8 text-center bg-[#E3E3E3]/50 transition-colors hover:border-[#234C6A]/50">
            <Input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.getElementById("resume-upload")?.click()}
              className="mx-auto text-lg px-8 border-[#234C6A] text-[#234C6A]"
            >
              <Upload className="h-5 w-5 mr-2" />
              {file ? file.name : "Upload Resume (PDF, DOC, DOCX)"}
            </Button>
            <p className="text-sm text-[#234C6A] mt-4">
              Supported formats: PDF, DOC, DOCX (Max 5MB)
            </p>
          </div>

          {file && !results && (
            <div className="text-center">
              <Button
                onClick={analyzeResume}
                disabled={analyzing}
                className="text-lg px-8 py-6 bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
                size="lg"
              >
                {analyzing ? "Analyzing Your Resume..." : "Analyze Resume Now"}
              </Button>
              <p className="text-sm text-[#234C6A] mt-4">
                This analysis will take approximately 20-30 seconds
              </p>
            </div>
          )}

          {analyzing && (
            <div className="space-y-6">
              <p className="text-center text-lg text-[#234C6A]">
                Analyzing your resume for keywords, structure, and optimization...
              </p>
              <div className="max-w-lg mx-auto">
                <Progress value={60} className="w-full h-3 bg-[#456882]/20" indicatorColor="bg-[#234C6A]" />
                <div className="flex justify-between mt-2 text-sm text-[#234C6A]">
                  <span>Scanning content</span>
                  <span>Checking keywords</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-[#234C6A]/5 rounded-lg">
                  <Clock className="h-8 w-8 text-[#234C6A] mb-2" />
                  <p className="font-medium text-[#234C6A]">Analyzing keywords</p>
                </div>
                <div className="p-4 bg-[#456882]/5 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-[#456882] mb-2" />
                  <p className="font-medium text-[#456882]">Measuring compatibility</p>
                </div>
                <div className="p-4 bg-[#234C6A]/5 rounded-lg">
                  <Target className="h-8 w-8 text-[#234C6A] mb-2" />
                  <p className="font-medium text-[#234C6A]">Optimization tips</p>
                </div>
              </div>
            </div>
          )}

          {results && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              {/* Overall Score */}
              <div className="text-center p-8 bg-gradient-to-br from-[#234C6A]/5 to-[#456882]/5 rounded-xl">
                <p className="text-sm text-[#234C6A] mb-2 font-medium">
                  Overall Score
                </p>
                <div className="flex items-center justify-center gap-8">
                  <div className="text-7xl font-bold bg-gradient-to-r from-[#234C6A] to-[#456882] bg-clip-text text-transparent">
                    {results.score}/100
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-bold text-[#234C6A]">{results.score >= 80 ? "Excellent" : results.score >= 70 ? "Good" : "Needs Improvement"}</div>
                    <p className="text-[#234C6A] mt-2">Your resume is competitive for {results.targetRole}</p>
                  </div>
                </div>
                <div className="w-full max-w-md mx-auto mt-6">
                  <Progress value={results.score} className="h-2 bg-[#456882]/20" indicatorColor="bg-[#234C6A]" />
                </div>
              </div>

              {/* Resume Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-[#234C6A]/5">
                  <User className="h-5 w-5 text-[#234C6A] mb-2" />
                  <p className="text-sm text-[#234C6A]">Experience</p>
                  <p className="font-semibold text-[#234C6A]">{results.experience} years</p>
                </div>
                <div className="p-4 rounded-lg bg-[#456882]/5">
                  <Briefcase className="h-5 w-5 text-[#456882] mb-2" />
                  <p className="text-sm text-[#234C6A]">Education</p>
                  <p className="font-semibold text-[#234C6A]">{results.education}</p>
                </div>
                <div className="p-4 rounded-lg bg-[#234C6A]/5">
                  <Globe className="h-5 w-5 text-[#234C6A] mb-2" />
                  <p className="text-sm text-[#234C6A]">Location</p>
                  <p className="font-semibold text-[#234C6A]">{results.location}</p>
                </div>
                <div className="p-4 rounded-lg bg-[#456882]/5">
                  <Target className="h-5 w-5 text-[#456882] mb-2" />
                  <p className="text-sm text-[#234C6A]">Target Role</p>
                  <p className="font-semibold truncate text-[#234C6A]">{results.targetRole}</p>
                </div>
              </div>

              {/* Strengths */}
              <div className="bg-[#E3E3E3]/50 rounded-xl p-6">
                <h3 className="font-semibold text-xl mb-4 flex items-center gap-2 text-[#234C6A]">
                  <CheckCircle2 className="h-6 w-6 text-[#234C6A]" />
                  Resume Strengths
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.strengths.map((strength: any, i: number) => (
                    <div key={i} className="p-4 bg-[#E3E3E3] rounded-lg">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-lg text-[#234C6A]">{strength.title}</h4>
                        <Badge variant="secondary" className="text-xs bg-[#234C6A]/20 text-[#234C6A]">
                          {strength.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#234C6A] mt-2">{strength.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-[#E3E3E3]/50 rounded-xl p-6">
                <h3 className="font-semibold text-xl mb-4 flex items-center gap-2 text-[#234C6A]">
                  <AlertCircle className="h-6 w-6 text-yellow-500" />
                  Areas for Improvement
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.improvements.map((improvement: any, i: number) => (
                    <div key={i} className="p-4 bg-[#E3E3E3] rounded-lg">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-lg text-[#234C6A]">{improvement.title}</h4>
                        <Badge variant="secondary" className="text-xs bg-yellow-500/10 text-yellow-700">
                          {improvement.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#234C6A] mt-2">{improvement.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <h3 className="font-semibold text-xl mb-4 text-[#234C6A]">Key Keywords Found</h3>
                <div className="flex flex-wrap gap-2">
                  {results.keywords.map((keyword: string, i: number) => (
                    <Badge
                      key={i}
                      variant="default"
                      className="px-4 py-2 rounded-full text-sm bg-[#234C6A]/10 text-[#234C6A] hover:bg-[#234C6A]/20"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* ATS Compatibility */}
              <div className="p-6 bg-gradient-to-br from-[#456882]/5 to-[#234C6A]/5 rounded-xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-xl mb-1 text-[#234C6A]">ATS Compatibility</h3>
                    <p className="text-sm text-[#234C6A]">
                      {results.atsCompatibility >= 80
                        ? "Your resume is well optimized for Applicant Tracking Systems"
                        : "Consider optimizing your resume for better ATS compatibility"}
                    </p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#456882]">{results.atsCompatibility}%</span>
                    <span className="text-[#234C6A]">Compatibility</span>
                  </div>
                </div>
                <div className="w-full mt-4">
                  <Progress value={results.atsCompatibility} className="w-full h-3 bg-[#456882]/20" indicatorColor="bg-[#456882]" />
                </div>

                {/* Optimization Tips */}
                <div className="mt-6">
                  <h4 className="font-medium mb-3 text-[#234C6A]">Optimization Tips</h4>
                  <ul className="space-y-2">
                    {results.optimizationTips.map((tip: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#234C6A]">
                        <span className="text-[#456882] mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => {
                    setFile(null);
                    setResults(null);
                  }}
                  variant="outline"
                  className="text-lg py-6 flex-1 border-[#234C6A] text-[#234C6A]"
                >
                  Analyze Another Resume
                </Button>
                <Button className="text-lg py-6 flex-1 bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white">
                  Download Detailed Report
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
