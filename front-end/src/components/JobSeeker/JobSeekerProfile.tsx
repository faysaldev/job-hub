"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { User, Save, X, Loader2, Sparkles } from "lucide-react";
import {
  useGetSeekerProfileQuery,
  useCreateSeekerProfileMutation,
  useUpdateSeekerProfileMutation,
} from "@/src/redux/features/seeker/seekerApi";
import { useUpdateProfileMutation } from "@/src/redux/features/user/userApi";
import { useAppSelector, useAppDispatch } from "@/src/redux/hooks";
import {
  selectCurrentUser,
  selectToken,
  setUser,
} from "@/src/redux/features/auth/authSlice";
import { toast } from "sonner";
import { ProfileFormValues } from "@/src/types";

// Sub-components
import ProfileHeader from "./JobSeeker/ProfileHeader";
import SkillsSection from "./JobSeeker/Skillssection";
import ExperienceSection from "./JobSeeker/Experiencesection";
import EducationSection from "./JobSeeker/Educationsection";
import ResumePortfolioSection from "./JobSeeker/Resumeportfoliosection";
import {
  LogisticsSection,
  ProjectsSection,
  SocialLinksSection,
} from "./JobSeeker/LogisticsAndProjects";

// Bio section — isolated so typing doesn't re-render siblings
const BioSection = memo(
  ({ editing, bio }: { editing: boolean; bio: string }) => {
    const { register } = useFormContext<ProfileFormValues>();
    return (
      <Card className="p-8 border-[#456882]/30 bg-white shadow-lg rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#234C6A]/10 rounded-xl">
            <User className="h-5 w-5 text-[#234C6A]" />
          </div>
          <h3 className="text-xl font-bold text-[#234C6A]">About Me</h3>
        </div>
        {editing ? (
          <textarea
            {...register("bio")}
            placeholder="Write a brief professional summary..."
            className="w-full min-h-[150px] p-4 border border-[#456882]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234C6A] bg-gray-50"
          />
        ) : (
          <p className="text-[#234C6A]/90 leading-relaxed text-lg">
            {bio || "No bio added yet. Tell us about your journey!"}
          </p>
        )}
      </Card>
    );
  },
);
BioSection.displayName = "BioSection";

const ProfileStrengthIndicator = ({ strength }: { strength: number }) => {
  return (
    <Card className="p-6 border-none bg-gradient-to-br from-[#234C6A] to-[#456882] text-white rounded-2xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-400" />
          <h4 className="font-bold">Profile Strength</h4>
        </div>
        <span className="text-2xl font-black">{strength}%</span>
      </div>
      <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-1000"
          style={{ width: `${strength}%` }}
        />
      </div>
      <p className="text-xs mt-3 text-blue-100/80 font-medium">
        {strength < 100
          ? "Complete your profile to stand out to top recruiters!"
          : "Perfect! Your profile is fully optimized."}
      </p>
    </Card>
  );
};

interface JobSeekerProfileProps {
  userId: string;
}

const JobSeekerProfile = ({ userId }: JobSeekerProfileProps) => {
  const [editing, setEditing] = useState(false);
  const [imageState, setImageState] = useState<{
    file: File | null;
    preview: string | null;
  }>({
    file: null,
    preview: null,
  });

  const currentUser = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectToken);
  const dispatch = useAppDispatch();

  const { data: profileResponse, isLoading: isFetching } =
    useGetSeekerProfileQuery();
  const [createProfile, { isLoading: isCreating }] =
    useCreateSeekerProfileMutation();
  const [updateSeekerProfile, { isLoading: isUpdatingSeeker }] =
    useUpdateSeekerProfileMutation();
  const [updateUserBasicInfo, { isLoading: isUpdatingUser }] =
    useUpdateProfileMutation();

  const isSaving = isUpdatingSeeker || isCreating || isUpdatingUser;
  const profileData = (profileResponse as any)?.data;

  const methods = useForm<ProfileFormValues>({
    defaultValues: {
      name: "",
      phoneNumber: "",
      headline: "",
      bio: "",
      location: "",
      website: "",
      resume: "",
      skills: [],
      totalExperience: "",
      experienceLevel: "",
      availability: "",
      jobType: "",
      socialProfiles: {
        linkedin: "",
        github: "",
        twitter: "",
      },
      recentProjects: [],
      experience: [],
      education: [],
    },
    // mode: "onChange" intentionally omitted — validate on submit only for perf
  });

  const { handleSubmit, reset, watch } = methods;

  // Populate form once data arrives
  useEffect(() => {
    if (!profileData && !currentUser) return;
    const data = profileData || {};
    reset({
      name: currentUser?.name || "",
      phoneNumber: currentUser?.phoneNumber || "",
      headline: data.designation || "",
      bio: data.aboutMe || "",
      location: data.userLocation || "",
      website: data.portfolio || "",
      resume: data.resume?.resumeLink || "",
      skills: data.skills || [],
      totalExperience: data.totalExperience || "",
      experienceLevel: data.experienceLevel || "",
      availability: data.availability || "",
      jobType: data.jobType || "",
      socialProfiles: {
        linkedin: data.socialProfiles?.linkedin || "",
        github: data.socialProfiles?.github || "",
        twitter: data.socialProfiles?.twitter || "",
      },
      recentProjects: data.recentProjects || [],
      experience:
        data.workExperiences?.map((exp: any) => ({
          id: exp._id || Math.random().toString(),
          title: exp.position,
          company: exp.companyName,
          startDate: exp.durationFrom,
          endDate: exp.durationTo === "Present" ? "" : exp.durationTo,
          current: exp.durationTo === "Present",
          description: exp.responsibilities?.[0] || "",
        })) || [],
      education:
        data.educations?.map((edu: any) => ({
          id: edu._id || Math.random().toString(),
          institution: edu.school,
          degree: edu.degree,
          startDate: edu.year?.split(" - ")[0] || "",
          endDate:
            edu.year?.split(" - ")[1] === "Present"
              ? ""
              : edu.year?.split(" - ")[1],
          current: edu.year?.includes("Present") || false,
        })) || [],
    });
    if (currentUser?.image)
      setImageState({ file: null, preview: currentUser.image });
  }, [profileData, currentUser, reset]);

  const handleImageChange = useCallback((file: File, preview: string) => {
    setImageState({ file, preview });
  }, []);

  const toggleEdit = useCallback(() => {
    if (editing) reset(); // revert
    setEditing((v) => !v);
  }, [editing, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Update user basic info if changed
      if (
        data.name !== currentUser?.name ||
        data.phoneNumber !== currentUser?.phoneNumber ||
        imageState.file
      ) {
        const formData = new FormData();
        if (data.name !== currentUser?.name) formData.append("name", data.name);
        if (data.phoneNumber !== currentUser?.phoneNumber)
          formData.append("phoneNumber", data.phoneNumber);
        if (imageState.file) formData.append("image", imageState.file);

        const res = await updateUserBasicInfo(formData).unwrap();
        if (res?.data && token) {
          dispatch(
            setUser({
              user: { ...res.data, id: res.data.id || res.data._id },
              token,
            }),
          );
        }
      }

      // Build seeker profile payload
      const seekerProfileData = {
        userLocation: data.location,
        designation: data.headline,
        aboutMe: data.bio,
        skills: data.skills,
        totalExperience: data.totalExperience,
        experienceLevel: data.experienceLevel,
        availability: data.availability,
        jobType: data.jobType,
        socialProfiles: data.socialProfiles,
        recentProjects: data.recentProjects,
        workExperiences: data.experience?.map((exp) => ({
          position: exp.title,
          durationFrom: exp.startDate,
          durationTo: exp.current ? "Present" : exp.endDate,
          companyName: exp.company,
          responsibilities: [exp.description],
        })),
        educations: data.education?.map((edu) => ({
          school: edu.institution,
          degree: edu.degree,
          year: `${edu.startDate} - ${edu.endDate || "Present"}`,
        })),
        resume: { resumeName: "Resume", resumeLink: data.resume || "" },
        portfolio: data.website,
      };

      if (profileResponse) {
        await updateSeekerProfile(seekerProfileData as any).unwrap();
        toast.success("Profile updated successfully!");
      } else {
        await createProfile(seekerProfileData as any).unwrap();
        toast.success("Profile created successfully!");
      }

      setEditing(false);
      setImageState((prev) => ({ ...prev, file: null }));
    } catch (error: any) {
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
    <FormProvider {...methods}>
      <div className="space-y-8">
        {/* Toolbar */}
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-[#234C6A]">
            Your Professional Profile
          </h2>
          {editing ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={toggleEdit}
                className="border-[#456882] text-[#234C6A] hover:bg-[#456882]/10"
                disabled={isSaving}
              >
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                className="bg-[#234C6A] hover:bg-[#456882]"
                disabled={isSaving}
              >
                {isSaving ? (
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <ProfileHeader
              editing={editing}
              control={methods.control}
              register={methods.register}
              currentUser={currentUser}
              profileData={profileData}
              imagePreview={imageState.preview}
              onImageChange={handleImageChange}
            />
            <LogisticsSection editing={editing} />
            <BioSection editing={editing} bio={profileData?.aboutMe || ""} />
          </div>

          <div className="space-y-8">
            <ProfileStrengthIndicator
              strength={profileData?.profileStrength || 0}
            />
            <SocialLinksSection editing={editing} />
          </div>
        </div>

        <SkillsSection
          editing={editing}
          profileSkills={profileData?.skills || []}
        />
        <ProjectsSection editing={editing} />
        <ExperienceSection editing={editing} />
        <EducationSection editing={editing} />
        <ResumePortfolioSection editing={editing} profileData={profileData} />
      </div>
    </FormProvider>
  );
};

export default JobSeekerProfile;
