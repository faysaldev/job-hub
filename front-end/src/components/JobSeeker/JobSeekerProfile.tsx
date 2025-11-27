import { useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  ExternalLink,
} from "lucide-react";

interface JobSeekerProfileProps {
  userId: string;
}

const JobSeekerProfile = ({ userId }: JobSeekerProfileProps) => {
  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  // Dummy profile data
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    location: "San Francisco, CA",
    title: "Senior Frontend Developer",
    bio: "Passionate frontend developer with 6+ years of experience building scalable web applications. Expert in React, TypeScript, and modern CSS frameworks. Love solving complex problems with elegant solutions.",
    skills: [
      "React",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "GraphQL",
      "Jest",
      "Node.js",
      "UI/UX Design",
    ],
    experience: [
      {
        id: "exp1",
        company: "TechCorp Inc.",
        position: "Senior Frontend Developer",
        duration: "2021 - Present",
        description:
          "Leading frontend development for enterprise applications. Mentoring junior developers and implementing design systems.",
      },
      {
        id: "exp2",
        company: "StartUpXYZ",
        position: "Frontend Developer",
        duration: "2019 - 2021",
        description:
          "Built responsive web applications using React and TypeScript. Collaborated with designers to implement pixel-perfect UIs.",
      },
    ],
    education: [
      {
        id: "edu1",
        school: "University of California",
        degree: "B.S. Computer Science",
        year: "2015 - 2019",
      },
    ],
    resumeUrl: "#",
    portfolioUrl: "https://alexjohnson.dev",
  });

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((_, i) => i !== index),
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const [newExperience, setNewExperience] = useState({
    company: "",
    position: "",
    duration: "",
    description: "",
  });

  const addExperience = () => {
    if (newExperience.company && newExperience.position) {
      const newExp = {
        id: `exp${profile.experience.length + 1}`,
        ...newExperience,
      };
      setProfile({
        ...profile,
        experience: [...profile.experience, newExp],
      });
      setNewExperience({
        company: "",
        position: "",
        duration: "",
        description: "",
      });
    }
  };

  const removeExperience = (id: string) => {
    setProfile({
      ...profile,
      experience: profile.experience.filter((exp) => exp.id !== id),
    });
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setProfile({
      ...profile,
      experience: profile.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const [newEducationItem, setNewEducationItem] = useState({
    school: "",
    degree: "",
    year: "",
  });

  const addEducation = () => {
    if (newEducationItem.school && newEducationItem.degree) {
      const newEdu = {
        id: `edu${profile.education.length + 1}`,
        ...newEducationItem,
      };
      setProfile({
        ...profile,
        education: [...profile.education, newEdu],
      });
      setNewEducationItem({
        school: "",
        degree: "",
        year: "",
      });
    }
  };

  const removeEducation = (id: string) => {
    setProfile({
      ...profile,
      education: profile.education.filter((edu) => edu.id !== id),
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setProfile({
      ...profile,
      education: profile.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const saveProfile = async () => {
    // Here you would typically call an API to save the profile
    try {
      // Example API call to save profile
      // const response = await fetch(`/api/users/${userId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(profile),
      // });

      // For demonstration purposes, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // If successful, we can show a success message or perform other actions
      setEditing(false);
      console.log("Profile saved:", profile);
    } catch (error) {
      console.error("Error saving profile:", error);
      // Handle error (show notification, etc.)
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-[#234C6A]">Your Profile</h2>
        {editing ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={toggleEdit}
              className="border-[#456882] text-[#234C6A] hover:bg-[#456882]/10"
            >
              Cancel
            </Button>
            <Button
              onClick={saveProfile}
              className="bg-[#234C6A] hover:bg-[#456882]"
            >
              Save Profile
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={toggleEdit}
            className="border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10"
          >
            Edit Profile
          </Button>
        )}
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
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="text-2xl font-bold mb-2 border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
              />
            ) : (
              <h3 className="text-2xl font-bold text-[#234C6A]">
                {profile.name}
              </h3>
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
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="mt-4 text-lg italic border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
              />
            ) : (
              <p className="mt-4 text-lg italic text-[#234C6A]/80">
                {profile.title}
              </p>
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
            onChange={(e) => handleInputChange("bio", e.target.value)}
            className="w-full min-h-[150px] p-3 border border-[#456882]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#234C6A] focus:border-[#234C6A]"
          />
        ) : (
          <p className="text-[#234C6A]/90">{profile.bio}</p>
        )}
      </Card>

      {/* Skills Section */}
      <Card className="p-6 border-[#456882]/30 bg-white">
        <h3 className="text-xl font-semibold mb-4 text-[#234C6A]">
          Skills & Expertise
        </h3>

        {editing ? (
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.skills.map((skill, index) => (
                <div key={index} className="relative">
                  <Badge
                    variant="secondary"
                    className="px-4 py-2 text-base bg-[#234C6A]/10 text-[#234C6A] hover:bg-[#234C6A]/20 flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="ml-2 text-[#234C6A]/70 hover:text-[#234C6A]"
                    >
                      ×
                    </button>
                  </Badge>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a new skill"
                className="flex-1 border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button
                type="button"
                onClick={addSkill}
                className="bg-[#234C6A] hover:bg-[#456882]"
              >
                Add
              </Button>
            </div>
          </div>
        ) : (
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
        )}
      </Card>

      {/* Experience Section */}
      <Card className="p-6 border-[#456882]/30 bg-white">
        <h3 className="text-xl font-semibold mb-4 text-[#234C6A] flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Work Experience
        </h3>

        {editing ? (
          <div>
            <div className="space-y-6 mb-6">
              {profile.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="border-l-2 border-[#456882]/30 pl-4 py-1 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    className="absolute -left-6 text-[#234C6A] hover:text-[#456882]"
                  >
                    ×
                  </button>
                  <div className="flex justify-between">
                    <Input
                      value={exp.position}
                      onChange={(e) =>
                        updateExperience(exp.id, "position", e.target.value)
                      }
                      placeholder="Position"
                      className="font-semibold border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A] mb-1"
                    />
                    <Input
                      value={exp.duration}
                      onChange={(e) =>
                        updateExperience(exp.id, "duration", e.target.value)
                      }
                      placeholder="Duration"
                      className="text-[#234C6A]/70 border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                    />
                  </div>
                  <Input
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(exp.id, "company", e.target.value)
                    }
                    placeholder="Company"
                    className="text-[#234C6A]/80 border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                  />
                  <textarea
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(exp.id, "description", e.target.value)
                    }
                    placeholder="Description"
                    className="w-full mt-2 p-2 border border-[#456882]/30 rounded focus:outline-none focus:ring-2 focus:ring-[#234C6A] focus:border-[#234C6A]"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-[#234C6A]">Add New Experience</h4>
              <Input
                value={newExperience.company}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, company: e.target.value })
                }
                placeholder="Company"
                className="border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
              />
              <Input
                value={newExperience.position}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, position: e.target.value })
                }
                placeholder="Position"
                className="border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
              />
              <Input
                value={newExperience.duration}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, duration: e.target.value })
                }
                placeholder="Duration (e.g., 2021 - Present)"
                className="border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
              />
              <textarea
                value={newExperience.description}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    description: e.target.value,
                  })
                }
                placeholder="Description"
                className="w-full p-2 border border-[#456882]/30 rounded focus:outline-none focus:ring-2 focus:ring-[#234C6A] focus:border-[#234C6A]"
              />
              <Button
                type="button"
                onClick={addExperience}
                className="bg-[#234C6A] hover:bg-[#456882]"
              >
                Add Experience
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {profile.experience.map((exp) => (
              <div
                key={exp.id}
                className="border-l-2 border-[#456882]/30 pl-4 py-1"
              >
                <div className="flex justify-between">
                  <h4 className="font-semibold text-[#234C6A]">{exp.position}</h4>
                  <span className="text-[#234C6A]/70">{exp.duration}</span>
                </div>
                <p className="text-[#234C6A]/80">{exp.company}</p>
                <p className="mt-2 text-[#234C6A]/90">{exp.description}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Education Section */}
      <Card className="p-6 border-[#456882]/30 bg-white">
        <h3 className="text-xl font-semibold mb-4 text-[#234C6A] flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Education
        </h3>

        {editing ? (
          <div>
            <div className="space-y-4 mb-6">
              {profile.education.map((edu) => (
                <div
                  key={edu.id}
                  className="border-l-2 border-[#456882]/30 pl-4 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeEducation(edu.id)}
                    className="absolute -left-6 text-[#234C6A] hover:text-[#456882]"
                  >
                    ×
                  </button>
                  <Input
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(edu.id, "degree", e.target.value)
                    }
                    placeholder="Degree"
                    className="font-semibold border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A] mb-1"
                  />
                  <Input
                    value={edu.school}
                    onChange={(e) =>
                      updateEducation(edu.id, "school", e.target.value)
                    }
                    placeholder="School"
                    className="text-[#234C6A]/80 border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A] mb-1"
                  />
                  <Input
                    value={edu.year}
                    onChange={(e) =>
                      updateEducation(edu.id, "year", e.target.value)
                    }
                    placeholder="Year (e.g., 2015 - 2019)"
                    className="text-[#234C6A]/70 border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-[#234C6A]">Add New Education</h4>
              <Input
                value={newEducationItem.school}
                onChange={(e) =>
                  setNewEducationItem({ ...newEducationItem, school: e.target.value })
                }
                placeholder="School/University"
                className="border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
              />
              <Input
                value={newEducationItem.degree}
                onChange={(e) =>
                  setNewEducationItem({ ...newEducationItem, degree: e.target.value })
                }
                placeholder="Degree"
                className="border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
              />
              <Input
                value={newEducationItem.year}
                onChange={(e) =>
                  setNewEducationItem({ ...newEducationItem, year: e.target.value })
                }
                placeholder="Year (e.g., 2015 - 2019)"
                className="border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
              />
              <Button
                type="button"
                onClick={addEducation}
                className="bg-[#234C6A] hover:bg-[#456882]"
              >
                Add Education
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {profile.education.map((edu) => (
              <div key={edu.id} className="border-l-2 border-[#456882]/30 pl-4">
                <h4 className="font-semibold text-[#234C6A]">{edu.degree}</h4>
                <p className="text-[#234C6A]/80">{edu.school}</p>
                <p className="text-[#234C6A]/70">{edu.year}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Resume & Portfolio */}
      <Card className="p-6 border-[#456882]/30 bg-white">
        <h3 className="text-xl font-semibold mb-4 text-[#234C6A]">
          Documents & Links
        </h3>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#234C6A] mb-1">
                Resume URL
              </label>
              <Input
                value={profile.resumeUrl}
                onChange={(e) => handleInputChange("resumeUrl", e.target.value)}
                placeholder="Enter resume URL"
                className="border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#234C6A] mb-1">
                Portfolio URL
              </label>
              <Input
                value={profile.portfolioUrl}
                onChange={(e) => handleInputChange("portfolioUrl", e.target.value)}
                placeholder="Enter portfolio URL"
                className="border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-start gap-2 border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10"
            >
              <ExternalLink className="h-4 w-4" />
              View Resume (PDF)
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-start gap-2 border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Portfolio
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default JobSeekerProfile;
