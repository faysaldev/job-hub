import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building2,
  Users,
  Star,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Job, Application } from "@/src/types";
import { toast } from "@/src/hooks/use-toast";
import { Textarea } from "@/src/components/ui/textarea";

const JobDetail = () => {
  const { id } = useParams();

  // Mock job data - in a real app, this would be fetched based on the id
  const job = {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "Remote",
    type: "Full-time",
    salary: "$100k - $150k",
    posted: "2 days ago",
    description:
      "We're looking for an experienced Frontend Developer to join our growing team and help build the next generation of web applications.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "GraphQL"],
    responsibilities: [
      "Develop and maintain high-quality web applications",
      "Collaborate with designers and backend developers",
      "Write clean, maintainable, and well-documented code",
      "Participate in code reviews and technical discussions",
      "Mentor junior developers and contribute to team growth",
    ],
    requirements: [
      "5+ years of experience in frontend development",
      "Strong proficiency in React and TypeScript",
      "Experience with modern CSS frameworks",
      "Understanding of web performance optimization",
      "Excellent communication and collaboration skills",
    ],
    benefits: [
      "Competitive salary and equity package",
      "Health, dental, and vision insurance",
      "Flexible work schedule and remote work options",
      "Professional development budget",
      "401(k) matching program",
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Header */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {job.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    {job.type}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {job.posted}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Job Description */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {job.description}
                </p>
              </Card>

              {/* Responsibilities */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Responsibilities
                </h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((item, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="text-accent font-bold">•</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Requirements */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((item, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="text-accent font-bold">•</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Benefits */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
                <ul className="space-y-3">
                  {job.benefits.map((item, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="text-accent font-bold">•</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card className="p-6 sticky top-20">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                    <DollarSign className="h-6 w-6" />
                    {job.salary}
                  </div>
                  <Button
                    className="w-full bg-accent hover:bg-accent/90"
                    size="lg"
                  >
                    Apply Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    Save Job
                  </Button>
                </div>
              </Card>

              {/* Company Info */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">About {job.company}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>500-1000 employees</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>Technology & Software</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Star className="h-4 w-4 fill-current" />
                    <span>4.5/5 company rating</span>
                  </div>
                </div>
                <Button variant="link" className="mt-4 px-0">
                  View company profile
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobDetail;
