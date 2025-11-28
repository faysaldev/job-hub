/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Target, TrendingUp, BookOpen, Star, BarChart3, Users, Award, Clock, Flame } from "lucide-react";
import { Progress } from "@/src/components/ui/progress";

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
        growthRate: 23 // percentage
      },
      suggestedSkills: [
        {
          name: "Machine Learning",
          demand: 92,
          category: "AI/ML",
          difficulty: "Advanced"
        },
        {
          name: "Cloud Computing",
          demand: 88,
          category: "DevOps",
          difficulty: "Intermediate"
        },
        {
          name: "DevOps",
          demand: 85,
          category: "DevOps",
          difficulty: "Intermediate"
        },
        {
          name: "Agile Methodologies",
          demand: 78,
          category: "Management",
          difficulty: "Beginner"
        }
      ],
      careerPaths: [
        {
          title: "Full Stack Developer",
          match: 88,
          salary: "$120,000",
          jobCount: 1200
        },
        {
          title: "Software Engineer",
          match: 85,
          salary: "$115,000",
          jobCount: 1800
        },
        {
          title: "DevOps Engineer",
          match: 82,
          salary: "$130,000",
          jobCount: 900
        },
        {
          title: "Data Scientist",
          match: 75,
          salary: "$135,000",
          jobCount: 750
        }
      ],
      learningResources: [
        {
          name: "Advanced React Patterns",
          platform: "Udemy",
          rating: 4.8,
          duration: "12h",
          price: "$49.99"
        },
        {
          name: "System Design Interview",
          platform: "Coursera",
          rating: 4.7,
          duration: "24h",
          price: "Free with subscription"
        },
        {
          name: "AWS Certification Prep",
          platform: "LinkedIn Learning",
          rating: 4.9,
          duration: "18h",
          price: "$29.99/month"
        }
      ],
      skillGap: 25, // percentage
      recommendedPath: "Focus on cloud technologies and DevOps practices to maximize career growth"
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="bg-gradient-to-br from-[#456882] to-[#234C6A] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#456882] to-[#234C6A] bg-clip-text text-transparent">
            Advanced Skill Analyzer
          </h2>
          <p className="text-lg text-[#234C6A] max-w-2xl mx-auto">
            Discover which skills are in demand, identify gaps in your skillset, and get personalized career recommendations
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#234C6A] mb-2">
                Add Your Skills
              </label>
              <div className="flex gap-2">
                <Input
                  value={inputSkill}
                  onChange={(e) => setInputSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  placeholder="e.g., React, Python, Project Management, UI/UX Design"
                  className="text-lg py-6 border-[#234C6A]/30"
                />
                <Button
                  onClick={addSkill}
                  className="text-lg py-6 px-8 bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
                  disabled={!inputSkill.trim()}
                >
                  Add Skill
                </Button>
              </div>
            </div>

            {skills.length > 0 && (
              <div className="pt-4">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-[#234C6A]">
                    Your Skills ({skills.length})
                  </p>
                  {skills.length >= 3 && (
                    <Button
                      onClick={analyzeSkills}
                      className="text-sm bg-gradient-to-r from-[#456882] to-[#234C6A] hover:from-[#456882]/90 hover:to-[#234C6A]/90 text-white"
                    >
                      Analyze Skills
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <Badge
                      key={i}
                      variant="default"
                      className="px-4 py-2 text-sm cursor-pointer bg-[#234C6A]/10 hover:bg-[#234C6A]/20 text-[#234C6A] flex items-center gap-2"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill}
                      <span>×</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {skills.length > 0 && skills.length < 3 && (
            <div className="text-center p-8 bg-[#E3E3E3]/50 rounded-xl">
              <p className="text-lg text-[#234C6A]">
                Add at least {3 - skills.length} more skill{3 - skills.length > 1 ? 's' : ''} to get analysis
              </p>
            </div>
          )}

          {analysis && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
              {/* Market Demand Overview */}
              <div className="bg-gradient-to-br from-[#456882]/5 to-[#234C6A]/5 rounded-xl p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-[#234C6A]">Market Demand Overview</h3>
                    <p className="text-[#234C6A]">How your skills compare to current market needs</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-amber-500" />
                    <span className="font-semibold text-amber-500">Growth: +{analysis.marketDemand.growthRate}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-4 text-green-600 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      High Demand Skills
                    </h4>
                    <div className="space-y-3">
                      {analysis.marketDemand.high.map((skill: string, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-[#E3E3E3] rounded-lg">
                          <span className="font-medium text-[#234C6A]">{skill}</span>
                          <span className="text-green-600 font-medium">High</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-4 text-blue-600 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Medium Demand Skills
                    </h4>
                    <div className="space-y-3">
                      {analysis.marketDemand.medium.map((skill: string, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-[#E3E3E3] rounded-lg">
                          <span className="font-medium text-[#234C6A]">{skill}</span>
                          <span className="text-blue-600 font-medium">Medium</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skill Gap Analysis */}
              <div className="bg-[#E3E3E3]/50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-[#234C6A] mb-6">Skill Gap Analysis</h3>

                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-[#234C6A]">Skill Gap</span>
                    <span className="font-bold text-[#234C6A]">{analysis.skillGap}%</span>
                  </div>
                  <Progress value={analysis.skillGap} className="h-3 bg-[#456882]/20" indicatorColor="bg-[#234C6A]" />
                  <p className="text-sm text-[#234C6A] mt-2">
                    {analysis.skillGap > 20
                      ? "Consider learning new skills to stay competitive in the job market."
                      : "Your skills are well-aligned with market demands."}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-[#234C6A] mb-4">Recommended Action: {analysis.recommendedPath}</p>
                </div>
              </div>

              {/* Suggested Skills to Learn */}
              <div className="bg-[#E3E3E3]/50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-[#234C6A] mb-6 flex items-center gap-2">
                  <Star className="h-6 w-6 text-[#456882]" />
                  Skills to Learn Next
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.suggestedSkills.map((skill: any, i: number) => (
                    <div key={i} className="p-4 bg-[#E3E3E3] rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-[#234C6A]">{skill.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="bg-[#234C6A]/20 text-[#234C6A] border-[#234C6A]/30">
                              {skill.category}
                            </Badge>
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20">
                              {skill.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-[#456882]">{skill.demand}%</div>
                          <div className="text-xs text-[#234C6A]">Demand</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Progress value={skill.demand} className="h-2 bg-[#456882]/20" indicatorColor="bg-[#234C6A]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Path Recommendations */}
              <div className="bg-[#E3E3E3]/50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-[#234C6A] mb-6">Career Path Recommendations</h3>
                <div className="space-y-4">
                  {analysis.careerPaths.map((path: any, i: number) => (
                    <div
                      key={i}
                      className="p-5 bg-[#E3E3E3] rounded-lg transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-lg text-[#234C6A]">{path.title}</h4>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-[#234C6A]">
                            <span className="flex items-center gap-1">
                              <BarChart3 className="h-4 w-4 text-[#234C6A]" />
                              Match: {path.match}%
                            </span>
                            <span className="flex items-center gap-1">
                              <Award className="h-4 w-4 text-[#234C6A]" />
                              {path.salary}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-[#234C6A]" />
                              {path.jobCount} jobs
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-32">
                            <Progress value={path.match} className="h-2 bg-[#456882]/20" indicatorColor="bg-[#234C6A]" />
                          </div>
                          <Button variant="outline" className="text-[#456882] border-[#456882]">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Learning Resources */}
              <div>
                <h3 className="text-2xl font-bold text-[#234C6A] mb-6 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-[#234C6A]" />
                  Recommended Learning Resources
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysis.learningResources.map((resource: any, i: number) => (
                    <div
                      key={i}
                      className="p-5 bg-[#E3E3E3] rounded-lg transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-[#234C6A]">{resource.name}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          <span className="text-sm text-[#234C6A]">{resource.rating}</span>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm text-[#234C6A] mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-[#234C6A]" />
                          {resource.duration}
                        </span>
                        <Badge variant="outline" className="border-[#234C6A]/30">{resource.platform}</Badge>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <span className="font-semibold text-[#234C6A]">{resource.price}</span>
                        <Button variant="outline" size="sm" className="border-[#234C6A] text-[#234C6A]">
                          Enroll Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={() => {
                    setSkills([]);
                    setAnalysis(null);
                  }}
                  variant="outline"
                  className="text-lg py-6 flex-1 border-[#234C6A] text-[#234C6A]"
                >
                  Start New Analysis
                </Button>
                <Button className="text-lg py-6 flex-1 bg-gradient-to-r from-[#456882] to-[#234C6A] hover:from-[#456882]/90 hover:to-[#234C6A]/90 text-white">
                  Download Skills Report
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillAnalyzer;
