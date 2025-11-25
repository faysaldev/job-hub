/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/src/components/ui/progress";

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
        score: 78,
        strengths: [
          "Strong technical skills section",
          "Clear work experience descriptions",
          "Quantifiable achievements included",
        ],
        improvements: [
          "Add more action verbs",
          "Include certifications section",
          "Optimize for ATS keywords",
        ],
        keywords: ["React", "TypeScript", "Leadership", "Problem Solving"],
        atsCompatibility: 85,
      });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <Card className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Resume Analyzer</h2>
          <p className="text-muted-foreground">
            Upload your resume to get instant feedback and improve your chances
            of landing interviews
          </p>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
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
              className="mx-auto"
            >
              <Upload className="h-5 w-5 mr-2" />
              {file ? file.name : "Upload Resume"}
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Supported formats: PDF, DOC, DOCX (Max 5MB)
            </p>
          </div>

          {file && !results && (
            <Button
              onClick={analyzeResume}
              disabled={analyzing}
              className="w-full"
              size="lg"
            >
              {analyzing ? "Analyzing..." : "Analyze Resume"}
            </Button>
          )}

          {analyzing && (
            <div className="space-y-3">
              <p className="text-center text-muted-foreground">
                Analyzing your resume...
              </p>
              <Progress value={60} className="w-full" />
            </div>
          )}

          {results && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Overall Score
                </p>
                <p className="text-5xl font-bold text-primary">
                  {results.score}/100
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {results.strengths.map((strength: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-muted-foreground"
                    >
                      <span className="text-green-500 mt-1">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {results.improvements.map(
                    (improvement: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-muted-foreground"
                      >
                        <span className="text-yellow-500 mt-1">•</span>
                        {improvement}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Key Keywords Found</h3>
                <div className="flex flex-wrap gap-2">
                  {results.keywords.map((keyword: string, i: number) => (
                    <span
                      key={i}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-accent/5 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">ATS Compatibility</span>
                  <span className="text-2xl font-bold text-accent">
                    {results.atsCompatibility}%
                  </span>
                </div>
                <Progress value={results.atsCompatibility} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  Your resume is{" "}
                  {results.atsCompatibility >= 80 ? "well" : "moderately"}{" "}
                  optimized for Applicant Tracking Systems
                </p>
              </div>

              <Button
                onClick={() => {
                  setFile(null);
                  setResults(null);
                }}
                variant="outline"
                className="w-full"
              >
                Analyze Another Resume
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ResumeAnalyzer;
