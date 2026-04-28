"use client";

import { useState, useEffect } from "react";
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
  Plus,
  Trash2,
  Save,
  X,
  Loader2,
  Sparkles,
  Clock,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import {
  useGetSeekerProfileQuery,
  useCreateSeekerProfileMutation,
  useUpdateSeekerProfileMutation,
} from "@/src/redux/features/seeker/seekerApi";
import { useUpdateProfileMutation } from "@/src/redux/features/user/userApi";
import { useAppSelector, useAppDispatch } from "@/src/redux/hooks";
import { selectCurrentUser, selectToken, setUser } from "@/src/redux/features/auth/authSlice";
import { toast } from "sonner";
import { Experience, Education, JobSeekerProfile as TJobSeekerProfile } from "@/src/types";
import { useRef } from "react";
import { Camera } from "lucide-react";

interface JobSeekerProfileProps {
  userId: string;
}

const JobSeekerProfile = ({ userId }: JobSeekerProfileProps) => {
  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const currentUser = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectToken);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profileResponse, isLoading: isFetching } = useGetSeekerProfileQuery();
  const [createProfile, { isLoading: isCreating }] = useCreateSeekerProfileMutation();
  const [updateSeekerProfile, { isLoading: isUpdatingSeeker }] = useUpdateSeekerProfileMutation();
  const [updateUserBasicInfo, { isLoading: isUpdatingUser }] = useUpdateProfileMutation();

  // Basic User Info State
  const [userName, setUserName] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Local state for editing
  const [profile, setProfile] = useState<Partial<TJobSeekerProfile>>({
    headline: "",
    bio: "",
    skills: [],
    experience: [],
    education: [],
    location: "",
    website: "",
    resume: "",
  });

  useEffect(() => {
    if (profileResponse) {
      setProfile(profileResponse);
    }
    if (currentUser) {
      setUserName(currentUser.name);
      setImagePreview(currentUser.image || null);
    }
  }, [profileResponse, currentUser]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills?.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...(profile.skills || []), newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setProfile({
      ...profile,
      skills: profile.skills?.filter((_, i) => i !== index),
    });
  };

  const handleInputChange = (field: keyof TJobSeekerProfile, value: any) => {
    setProfile({ ...profile, [field]: value });
  };

  const toggleEdit = () => {
    if (editing && profileResponse) {
      // Revert changes if cancelling
      setProfile(profileResponse);
    }
    setEditing(!editing);
  };

  const [newExperience, setNewExperience] = useState<Partial<Experience>>({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  const addExperience = () => {
    if (newExperience.title && newExperience.company) {
      const newExp = {
        ...newExperience,
        id: Math.random().toString(36).substr(2, 9),
      } as Experience;
      
      setProfile({
        ...profile,
        experience: [...(profile.experience || []), newExp],
      });
      setNewExperience({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      });
    } else {
      toast.error("Please fill in at least company and position");
    }
  };

  const removeExperience = (id: string) => {
    setProfile({
      ...profile,
      experience: profile.experience?.filter((exp) => exp.id !== id),
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setProfile({
      ...profile,
      experience: profile.experience?.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const [newEducationItem, setNewEducationItem] = useState<Partial<Education>>({
    institution: "",
    degree: "",
    startDate: "",
    endDate: "",
    current: false,
  });

  const addEducation = () => {
    if (newEducationItem.institution && newEducationItem.degree) {
      const newEdu = {
        ...newEducationItem,
        id: Math.random().toString(36).substr(2, 9),
      } as Education;
      
      setProfile({
        ...profile,
        education: [...(profile.education || []), newEdu],
      });
      setNewEducationItem({
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
        current: false,
      });
    } else {
      toast.error("Please fill in school and degree");
    }
  };

  const removeEducation = (id: string) => {
    setProfile({
      ...profile,
      education: profile.education?.filter((edu) => edu.id !== id),
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setProfile({
      ...profile,
      education: profile.education?.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const saveProfile = async () => {
    try {
      // 1. Handle User Basic Info Update (Name & Image)
      if (userName !== currentUser?.name || selectedImage) {
        const formData = new FormData();
        if (userName !== currentUser?.name) formData.append("name", userName);
        if (selectedImage) formData.append("image", selectedImage);

        const userUpdateResponse = await updateUserBasicInfo(formData).unwrap();
        
        // Update local auth state if backend returns the user
        // Ensure we map _id to id if necessary for frontend consistency
        if (userUpdateResponse?.data && token) {
          const userData = userUpdateResponse.data;
          dispatch(setUser({ 
            user: {
              ...userData,
              id: userData.id || userData._id
            }, 
            token 
          }));
        }
      }

      // 2. Handle Seeker Profile Update
      if (profileResponse) {
        // Update existing profile
        await updateSeekerProfile(profile).unwrap();
        toast.success("Profile updated successfully!");
      } else {
        // Create new profile
        await createProfile(profile).unwrap();
        toast.success("Profile created successfully!");
      }
      setEditing(false);
      setSelectedImage(null);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error?.data?.message || "Failed to save profile");
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-[#234C6A] mb-4" />
        <p className="text-[#456882] font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-[#234C6A]">Your Professional Profile</h2>
        {editing ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={toggleEdit}
              className="border-[#456882] text-[#234C6A] hover:bg-[#456882]/10"
              disabled={isUpdatingSeeker || isCreating || isUpdatingUser}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={saveProfile}
              className="bg-[#234C6A] hover:bg-[#456882]"
              disabled={isUpdatingSeeker || isCreating || isUpdatingUser}
            >
              {isUpdatingSeeker || isCreating || isUpdatingUser ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        ) : (
          <Button
            onClick={toggleEdit}
            className="bg-gradient-to-r from-[#234C6A] to-[#456882] text-white shadow-lg hover:shadow-xl rounded-xl px-6"
          >
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Header */}
      <Card className="p-8 border-[#456882]/30 bg-white shadow-xl rounded-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#234C6A] via-[#456882] to-[#234C6A]"></div>
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="flex-shrink-0 relative group">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <div 
              className={cn(
                "bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-3xl p-1 w-32 h-32 flex items-center justify-center shadow-lg transition-all duration-300",
                editing ? "cursor-pointer hover:scale-105" : "group-hover:scale-105"
              )}
              onClick={() => editing && fileInputRef.current?.click()}
            >
              <div className="bg-gray-50 border-4 border-white rounded-2xl w-28 h-28 flex items-center justify-center overflow-hidden relative">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-14 w-14 text-[#234C6A]" />
                )}
                {editing && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Camera className="text-white h-8 w-8" />
                  </div>
                )}
              </div>
            </div>
            {editing && (
              <Badge 
                className="absolute -bottom-2 -right-2 bg-white text-[#234C6A] border-[#234C6A]/20 shadow-md cursor-pointer hover:bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-3 w-3 mr-1" /> Change
              </Badge>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="space-y-1">
              {editing ? (
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your Full Name"
                  className="text-2xl font-bold border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A] bg-gray-50 max-w-md h-12"
                />
              ) : (
                <h3 className="text-3xl font-extrabold text-[#234C6A]">
                  {currentUser?.name}
                </h3>
              )}
              {editing ? (
                <Input
                  value={profile.headline}
                  onChange={(e) => handleInputChange("headline", e.target.value)}
                  placeholder="Professional Headline (e.g. Senior Frontend Developer)"
                  className="mt-2 text-lg border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A] bg-gray-50"
                />
              ) : (
                <p className="text-xl text-[#456882] font-medium italic">
                  {profile.headline || "No headline set"}
                </p>
              )}
            </div>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-[#456882] mt-4 font-medium">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#234C6A]/10 rounded-lg"><Mail className="h-4 w-4 text-[#234C6A]" /></div>
                <span>{currentUser?.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#234C6A]/10 rounded-lg"><MapPin className="h-4 w-4 text-[#234C6A]" /></div>
                {editing ? (
                  <Input
                    value={profile.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Location"
                    className="h-8 py-0 text-sm border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                  />
                ) : (
                  <span>{profile.location || "Location not set"}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Bio Section */}
      <Card className="p-8 border-[#456882]/30 bg-white shadow-lg rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#234C6A]/10 rounded-xl"><User className="h-5 w-5 text-[#234C6A]" /></div>
          <h3 className="text-xl font-bold text-[#234C6A]">About Me</h3>
        </div>

        {editing ? (
          <textarea
            value={profile.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            placeholder="Write a brief professional summary about yourself..."
            className="w-full min-h-[150px] p-4 border border-[#456882]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234C6A] focus:border-[#234C6A] bg-gray-50"
          />
        ) : (
          <p className="text-[#234C6A]/90 leading-relaxed text-lg">
            {profile.bio || "No bio added yet. Tell us about your journey!"}
          </p>
        )}
      </Card>

      {/* Skills Section */}
      <Card className="p-8 border-[#456882]/30 bg-white shadow-lg rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#234C6A]/10 rounded-xl"><Sparkles className="h-5 w-5 text-[#234C6A]" /></div>
          <h3 className="text-xl font-bold text-[#234C6A]">Skills & Expertise</h3>
        </div>

        {editing ? (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              {profile.skills?.map((skill, index) => (
                <Badge
                  key={index}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-[#234C6A] to-[#456882] text-white border-none shadow-md flex items-center gap-2 group"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="hover:text-red-200 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-3">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill (e.g. React, UI Design)"
                className="flex-1 border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A] h-12 rounded-xl"
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button
                type="button"
                onClick={addSkill}
                className="bg-[#234C6A] hover:bg-[#456882] h-12 px-6 rounded-xl"
              >
                <Plus className="h-5 w-5 mr-1" />
                Add
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {profile.skills && profile.skills.length > 0 ? (
              profile.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-5 py-2.5 text-base bg-[#234C6A]/10 text-[#234C6A] hover:bg-[#234C6A]/20 border-none rounded-xl"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-[#456882] italic">No skills added yet.</p>
            )}
          </div>
        )}
      </Card>

      {/* Experience Section */}
      <Card className="p-8 border-[#456882]/30 bg-white shadow-lg rounded-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-[#234C6A]/10 rounded-xl"><Briefcase className="h-5 w-5 text-[#234C6A]" /></div>
          <h3 className="text-xl font-bold text-[#234C6A]">Work Experience</h3>
        </div>

        <div className="space-y-8">
          {profile.experience?.map((exp) => (
            <div
              key={exp.id}
              className="group border-l-4 border-gradient-to-b from-[#234C6A] to-[#456882] pl-6 py-1 relative"
            >
              {editing && (
                <button
                  type="button"
                  onClick={() => removeExperience(exp.id)}
                  className="absolute -right-2 top-0 p-2 text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
              
              <div className="space-y-3">
                {editing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <Input
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                        placeholder="Job Title"
                        className="font-bold text-[#234C6A] border-[#456882]/30 focus:border-[#234C6A]"
                      />
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        placeholder="Company"
                        className="text-[#234C6A]/80 border-[#456882]/30 focus:border-[#234C6A]"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Input
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                          placeholder="Start Date"
                          className="border-[#456882]/30 focus:border-[#234C6A]"
                        />
                        <span className="text-[#456882]">-</span>
                        <Input
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                          placeholder="End Date"
                          disabled={exp.current}
                          className="border-[#456882]/30 focus:border-[#234C6A]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                          id={`current-${exp.id}`}
                          className="rounded border-[#234C6A] text-[#234C6A] focus:ring-[#234C6A]"
                        />
                        <label htmlFor={`current-${exp.id}`} className="text-sm font-medium text-[#456882]">I am currently working here</label>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                        placeholder="Describe your achievements and responsibilities..."
                        className="w-full p-4 border border-[#456882]/30 rounded-xl focus:ring-[#234C6A] bg-gray-50 min-h-[100px]"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <h4 className="text-xl font-bold text-[#234C6A]">{exp.title}</h4>
                      <div className="flex items-center gap-2 px-3 py-1 bg-[#234C6A]/5 rounded-full text-sm font-semibold text-[#456882]">
                        <Clock className="h-3.5 w-3.5" />
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-[#456882] flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      {exp.company}
                    </p>
                    <p className="text-[#234C6A]/80 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      {exp.description}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}

          {editing && (
            <div className="mt-10 p-6 bg-[#E3E3E3]/30 rounded-2xl border-2 border-dashed border-[#456882]/30">
              <h4 className="text-lg font-bold text-[#234C6A] mb-6 flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Experience
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Input
                    value={newExperience.title}
                    onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                    placeholder="Job Title (e.g. Software Engineer)"
                    className="border-[#456882]/30"
                  />
                  <Input
                    value={newExperience.company}
                    onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                    placeholder="Company Name"
                    className="border-[#456882]/30"
                  />
                </div>
                <div className="space-y-4">
                   <div className="flex items-center gap-2">
                    <Input
                      value={newExperience.startDate}
                      onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                      placeholder="Start Date"
                      className="border-[#456882]/30"
                    />
                    <Input
                      value={newExperience.endDate}
                      onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                      placeholder="End Date"
                      disabled={newExperience.current}
                      className="border-[#456882]/30"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newExperience.current}
                      onChange={(e) => setNewExperience({ ...newExperience, current: e.target.checked })}
                      id="new-exp-current"
                      className="rounded border-[#234C6A] text-[#234C6A] focus:ring-[#234C6A]"
                    />
                    <label htmlFor="new-exp-current" className="text-sm font-medium text-[#456882]">Currently working here</label>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <textarea
                    value={newExperience.description}
                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                    placeholder="Describe your role and impact..."
                    className="w-full p-4 border border-[#456882]/30 rounded-xl bg-white min-h-[100px]"
                  />
                </div>
                <Button
                  type="button"
                  onClick={addExperience}
                  className="bg-[#234C6A] hover:bg-[#456882] rounded-xl px-8"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Profile
                </Button>
              </div>
            </div>
          )}

          {!editing && (!profile.experience || profile.experience.length === 0) && (
            <p className="text-[#456882] italic text-center py-6 bg-gray-50 rounded-xl">No work experience added yet.</p>
          )}
        </div>
      </Card>

      {/* Education Section */}
      <Card className="p-8 border-[#456882]/30 bg-white shadow-lg rounded-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-[#234C6A]/10 rounded-xl"><GraduationCap className="h-5 w-5 text-[#234C6A]" /></div>
          <h3 className="text-xl font-bold text-[#234C6A]">Education</h3>
        </div>

        <div className="space-y-8">
          {profile.education?.map((edu) => (
            <div
              key={edu.id}
              className="group border-l-4 border-amber-400 pl-6 py-1 relative"
            >
              {editing && (
                <button
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  className="absolute -right-2 top-0 p-2 text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
              
              <div className="space-y-2">
                {editing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      placeholder="Degree/Certificate"
                      className="font-bold border-[#456882]/30"
                    />
                    <Input
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                      placeholder="School/University"
                      className="border-[#456882]/30"
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                        placeholder="Start Date"
                        className="border-[#456882]/30"
                      />
                      <Input
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                        placeholder="End Date"
                        className="border-[#456882]/30"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <h4 className="text-xl font-bold text-[#234C6A]">{edu.degree}</h4>
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-bold">
                        {edu.startDate} - {edu.endDate || "Present"}
                      </span>
                    </div>
                    <p className="text-lg font-medium text-[#456882] italic">{edu.institution}</p>
                  </>
                )}
              </div>
            </div>
          ))}

          {editing && (
            <div className="mt-10 p-6 bg-amber-50/30 rounded-2xl border-2 border-dashed border-amber-200">
              <h4 className="text-lg font-bold text-[#234C6A] mb-6 flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Education
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  value={newEducationItem.degree}
                  onChange={(e) => setNewEducationItem({ ...newEducationItem, degree: e.target.value })}
                  placeholder="Degree (e.g. B.S. Computer Science)"
                  className="border-[#456882]/30"
                />
                <Input
                  value={newEducationItem.institution}
                  onChange={(e) => setNewEducationItem({ ...newEducationItem, institution: e.target.value })}
                  placeholder="School/University"
                  className="border-[#456882]/30"
                />
                <div className="flex items-center gap-2">
                  <Input
                    value={newEducationItem.startDate}
                    onChange={(e) => setNewEducationItem({ ...newEducationItem, startDate: e.target.value })}
                    placeholder="Start Date"
                    className="border-[#456882]/30"
                  />
                  <Input
                    value={newEducationItem.endDate}
                    onChange={(e) => setNewEducationItem({ ...newEducationItem, endDate: e.target.value })}
                    placeholder="End Date"
                    className="border-[#456882]/30"
                  />
                </div>
                <div className="md:col-span-2">
                  <Button
                    type="button"
                    onClick={addEducation}
                    className="bg-amber-500 hover:bg-amber-600 rounded-xl px-8"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {!editing && (!profile.education || profile.education.length === 0) && (
            <p className="text-[#456882] italic text-center py-6 bg-gray-50 rounded-xl">No education added yet.</p>
          )}
        </div>
      </Card>

      {/* Resume & Portfolio */}
      <Card className="p-8 border-[#456882]/30 bg-white shadow-lg rounded-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-[#234C6A]/10 rounded-xl"><ExternalLink className="h-5 w-5 text-[#234C6A]" /></div>
          <h3 className="text-xl font-bold text-[#234C6A]">Documents & Professional Links</h3>
        </div>

        {editing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#234C6A]">Resume URL (Google Drive/Dropbox)</label>
              <Input
                value={profile.resume}
                onChange={(e) => handleInputChange("resume", e.target.value)}
                placeholder="https://..."
                className="border-[#456882]/30 rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#234C6A]">Personal Website/Portfolio</label>
              <Input
                value={profile.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://yourportfolio.com"
                className="border-[#456882]/30 rounded-xl h-12"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              variant="outline"
              onClick={() => profile.resume && window.open(profile.resume, '_blank')}
              className="h-16 flex items-center justify-start gap-4 border-2 border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/5 rounded-2xl group transition-all"
              disabled={!profile.resume}
            >
              <div className="w-10 h-10 rounded-xl bg-[#234C6A] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-bold">View Resume</p>
                <p className="text-xs text-[#456882]">{profile.resume ? "External Link" : "No resume uploaded"}</p>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto opacity-50" />
            </Button>

            <Button
              variant="outline"
              onClick={() => profile.website && window.open(profile.website, '_blank')}
              className="h-16 flex items-center justify-start gap-4 border-2 border-[#456882] text-[#234C6A] hover:bg-[#456882]/5 rounded-2xl group transition-all"
              disabled={!profile.website}
            >
              <div className="w-10 h-10 rounded-xl bg-[#456882] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-bold">Portfolio Website</p>
                <p className="text-xs text-[#456882]">{profile.website ? "Visit site" : "No link added"}</p>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto opacity-50" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default JobSeekerProfile;
