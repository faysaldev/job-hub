/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Target, TrendingUp, BookOpen, Star } from "lucide-react";

const SkillAnalyzer = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [inputSkill, setInputSkill] = useState("");
  const [analysis, setAnalysis] = useState<string | any>(null);

  const addSkill = () => {
    if (inputSkill.trim() && !skills.includes(inputSkill.trim())) {
      setSkills([...skills, inputSkill.trim()]);
      setInputSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
    setAnalysis(null);
  };

  const analyzeSkills = () => {
    // Simulate skill analysis
    setAnalysis({
      marketDemand: {
        high: skills.slice(0, Math.ceil(skills.length / 2)),
        medium: skills.slice(Math.ceil(skills.length / 2)),
      },
      suggestedSkills: [
        "Machine Learning",
        "Cloud Computing",
        "DevOps",
        "Agile Methodologies",
      ],
      careerPaths: [
        { title: "Full Stack Developer", match: 85 },
        { title: "Software Engineer", match: 80 },
        { title: "DevOps Engineer", match: 65 },
      ],
      learningResources: [
        { name: "Advanced React Patterns", platform: "Udemy" },
        { name: "System Design Interview", platform: "Coursera" },
        { name: "AWS Certification Prep", platform: "LinkedIn Learning" },
      ],
    });
  };

  return (
    <Card className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-accent" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Skill Analyzer</h2>
          <p className="text-muted-foreground">
            Discover which skills are in demand and get personalized career
            recommendations
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Add Your Skills
            </label>
            <div className="flex gap-2">
              <Input
                value={inputSkill}
                onChange={(e) => setInputSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSkill()}
                placeholder="e.g., React, Python, Project Management"
              />
              <Button onClick={addSkill}>Add</Button>
            </div>
          </div>

          {skills.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3">
                Your Skills ({skills.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm cursor-pointer"
                    onClick={() => removeSkill(skill)}
                  >
                    {skill} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {skills.length >= 3 && !analysis && (
            <Button onClick={analyzeSkills} className="w-full" size="lg">
              Analyze My Skills
            </Button>
          )}

          {skills.length > 0 && skills.length < 3 && (
            <p className="text-sm text-center text-muted-foreground">
              Add at least 3 skills to get analysis
            </p>
          )}

          {analysis && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-3 text-green-600">
                    High Demand Skills
                  </h3>
                  <div className="space-y-2">
                    {analysis.marketDemand.high.map(
                      (skill: string, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span>{skill}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-3 text-blue-600">
                    Medium Demand Skills
                  </h3>
                  <div className="space-y-2">
                    {analysis.marketDemand.medium.map(
                      (skill: string, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span>{skill}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent" />
                  Suggested Skills to Learn
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.suggestedSkills.map((skill: string, i: number) => (
                    <Badge key={i} variant="outline" className="px-3 py-1.5">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">
                  Career Path Recommendations
                </h3>
                <div className="space-y-3">
                  {analysis.careerPaths.map((path: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 border rounded-lg flex justify-between items-center"
                    >
                      <span className="font-medium">{path.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {path.match}% match
                        </span>
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent transition-all"
                            style={{ width: `${path.match}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Recommended Learning Resources
                </h3>
                <div className="space-y-2">
                  {analysis.learningResources.map(
                    (resource: any, i: number) => (
                      <div
                        key={i}
                        className="p-3 bg-muted/50 rounded-lg flex justify-between items-center"
                      >
                        <span>{resource.name}</span>
                        <Badge variant="outline">{resource.platform}</Badge>
                      </div>
                    )
                  )}
                </div>
              </div>

              <Button
                onClick={() => {
                  setSkills([]);
                  setAnalysis(null);
                }}
                variant="outline"
                className="w-full"
              >
                Start New Analysis
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SkillAnalyzer;
