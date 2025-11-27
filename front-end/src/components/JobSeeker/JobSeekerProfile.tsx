import { useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Badge } from "@/src/components/ui/badge";
import { User, Mail, MapPin, Briefcase, GraduationCap, Calendar, ExternalLink } from "lucide-react";

interface JobSeekerProfileProps {
  userId: string;
}

const JobSeekerProfile = ({ userId }: JobSeekerProfileProps) => {
  const [editing, setEditing] = useState(false);
  
  // Dummy profile data
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    location: "San Francisco, CA",
    title: "Senior Frontend Developer",
    bio: "Passionate frontend developer with 6+ years of experience building scalable web applications. Expert in React, TypeScript, and modern CSS frameworks. Love solving complex problems with elegant solutions.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL", "Jest", "Node.js", "UI/UX Design"],
    experience: [
      {
        id: "exp1",
        company: "TechCorp Inc.",
        position: "Senior Frontend Developer",
        duration: "2021 - Present",
        description: "Leading frontend development for enterprise applications. Mentoring junior developers and implementing design systems."
      },
      {
        id: "exp2",
        company: "StartUpXYZ",
        position: "Frontend Developer",
        duration: "2019 - 2021",
        description: "Built responsive web applications using React and TypeScript. Collaborated with designers to implement pixel-perfect UIs."
      }
    ],
    education: [
      {
        id: "edu1",
        school: "University of California",
        degree: "B.S. Computer Science",
        year: "2015 - 2019"
      }
    ],
    resumeUrl: "#",
    portfolioUrl: "https://alexjohnson.dev"
  });

  const handleInputChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const toggleEdit = () => {
    setEditing(!editing);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-[#234C6A]">Your Profile</h2>
        <Button 
          variant="outline" 
          onClick={toggleEdit}
          className="border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10"
        >
          {editing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {/* Profile Header */}
      <Card className="p-6 border-[#456882]/30 bg-white">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-2xl p-1 w-24 h-24 flex items-center justify-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20 flex items-center justify-center">
                <User className="h-10 w-10 text-[#234C6A]" />
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            {editing ? (
              <Input
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="text-2xl font-bold mb-2 border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
              />
            ) : (
              <h3 className="text-2xl font-bold text-[#234C6A]">{profile.name}</h3>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-[#234C6A] mt-2">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{profile.location}</span>
              </div>
            </div>
            
            {editing ? (
              <Input
                value={profile.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-4 text-lg italic border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
              />
            ) : (
              <p className="mt-4 text-lg italic text-[#234C6A]/80">{profile.title}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Bio Section */}
      <Card className="p-6 border-[#456882]/30 bg-white">
        <h3 className="text-xl font-semibold mb-4 text-[#234C6A]">About Me</h3>
        
        {editing ? (
          <textarea
            value={profile.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            className="w-full min-h-[150px] p-3 border border-[#456882]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#234C6A] focus:border-[#234C6A]"
          />
        ) : (
          <p className="text-[#234C6A]/90">{profile.bio}</p>
        )}
      </Card>

      {/* Skills Section */}
      <Card className="p-6 border-[#456882]/30 bg-white">
        <h3 className="text-xl font-semibold mb-4 text-[#234C6A]">Skills & Expertise</h3>
        
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="px-4 py-2 text-base bg-[#234C6A]/10 text-[#234C6A] hover:bg-[#234C6A]/20"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Experience Section */}
      <Card className="p-6 border-[#456882]/30 bg-white">
        <h3 className="text-xl font-semibold mb-4 text-[#234C6A] flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Work Experience
        </h3>
        
        <div className="space-y-6">
          {profile.experience.map((exp) => (
            <div key={exp.id} className="border-l-2 border-[#456882]/30 pl-4 py-1">
              <div className="flex justify-between">
                <h4 className="font-semibold text-[#234C6A]">{exp.position}</h4>
                <span className="text-[#234C6A]/70">{exp.duration}</span>
              </div>
              <p className="text-[#234C6A]/80">{exp.company}</p>
              <p className="mt-2 text-[#234C6A]/90">{exp.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Education Section */}
      <Card className="p-6 border-[#456882]/30 bg-white">
        <h3 className="text-xl font-semibold mb-4 text-[#234C6A] flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Education
        </h3>
        
        <div className="space-y-4">
          {profile.education.map((edu) => (
            <div key={edu.id} className="border-l-2 border-[#456882]/30 pl-4">
              <h4 className="font-semibold text-[#234C6A]">{edu.degree}</h4>
              <p className="text-[#234C6A]/80">{edu.school}</p>
              <p className="text-[#234C6A]/70">{edu.year}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Resume & Portfolio */}
      <Card className="p-6 border-[#456882]/30 bg-white">
        <h3 className="text-xl font-semibold mb-4 text-[#234C6A]">Documents & Links</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="flex items-center justify-start gap-2 border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10">
            <ExternalLink className="h-4 w-4" />
            View Resume (PDF)
          </Button>
          
          <Button variant="outline" className="flex items-center justify-start gap-2 border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10">
            <ExternalLink className="h-4 w-4" />
            Visit Portfolio
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default JobSeekerProfile;