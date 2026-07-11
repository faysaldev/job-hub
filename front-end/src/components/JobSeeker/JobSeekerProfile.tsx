"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  User,
  Save,
  X,
  Loader2,
  Sparkles,
  ShieldCheck,
  Edit3,
} from "lucide-react";
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
      <Card className="overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 shadow-sm backdrop-blur pt-0">
        <div className="border-b border-[#E3E3E3]/70 bg-gradient-to-r from-[#234C6A]/8 to-[#456882]/8 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#234C6A] text-white shadow-lg shadow-[#234C6A]/15">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#456882]">
                Summary
              </p>
              <h3 className="text-xl font-black text-[#234C6A]">About Me</h3>
            </div>
          </div>
        </div>
        <div className="p-5 md:p-6">
          {editing ? (
            <textarea
              {...register("bio")}
              placeholder="Write a brief professional summary..."
              className="min-h-[170px] w-full resize-none rounded-2xl border border-transparent bg-[#F4F7F8] p-4 text-[#234C6A] outline-none placeholder:text-[#456882]/55 focus:border-[#234C6A]/15 focus:bg-white focus:ring-2 focus:ring-[#234C6A]/10"
            />
          ) : (
            <p className="min-h-[110px] text-base font-medium leading-8 text-[#456882]">
              {bio || "No bio added yet. Tell us about your journey!"}
            </p>
          )}
        </div>
      </Card>
    );
  },
);
BioSection.displayName = "BioSection";

const calculateProfileStrength = (data: any, user: any) => {
  if (!data && !user) return 0;
  let strength = 0;

  // Basic Info (20%)
  if (data?.designation) strength += 5;
  if (data?.aboutMe) strength += 10;
  if (data?.userLocation) strength += 5;

  // Visual & Identity (10%)
  if (user?.image) strength += 10;

  // Skills (15%)
  if (data?.skills?.length > 0) strength += 15;

  // Experience (15%)
  if (data?.workExperiences?.length > 0) strength += 15;

  // Education (10%)
  if (data?.educations?.length > 0) strength += 10;

  // Projects (15%)
  if (data?.recentProjects?.length > 0) strength += 15;

  // Portfolio & Social (15%)
  if (data?.resume?.resumeLink) strength += 5;
  if (data?.portfolio) strength += 5;
  const social = data?.socialProfiles;
  if (social?.linkedin || social?.github || social?.twitter) strength += 5;

  return Math.min(strength, 100);
};

const ProfileStrengthIndicator = ({ strength }: { strength: number }) => {
  const checklist = [
    { label: "Core details", done: strength > 0 },
    { label: "Profile depth", done: strength >= 50 },
    { label: "Recruiter ready", done: strength >= 85 },
  ];

  return (
    <Card className="overflow-hidden rounded-3xl border-none bg-gradient-to-br from-[#234C6A] to-[#456882] text-white shadow-xl shadow-[#234C6A]/20">
      <div className="relative p-6">
        <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[3rem] bg-white/10" />
        <div className="relative z-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-white/65">
                  Completion
                </p>
                <h4 className="font-black">Profile Strength</h4>
              </div>
            </div>
            <span className="text-3xl font-black">{strength}%</span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-1000"
              style={{ width: `${strength}%` }}
            />
          </div>
          <p className="mt-3 text-sm font-medium leading-6 text-white/75">
            {strength < 100
              ? "Complete your profile to stand out to top recruiters."
              : "Perfect. Your profile is fully optimized."}
          </p>

          <div className="mt-5 space-y-2">
            {checklist.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-sm font-bold text-white/85"
              >
                {item.done ? (
                  <ShieldCheck className="h-4 w-4" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-white/40" />
                )}
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
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

  const { handleSubmit, reset } = methods;

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
        profileStrength: calculateProfileStrength(
          {
            designation: data.headline,
            aboutMe: data.bio,
            userLocation: data.location,
            skills: data.skills,
            workExperiences: data.experience,
            educations: data.education,
            recentProjects: data.recentProjects,
            resume: { resumeLink: data.resume },
            portfolio: data.website,
            socialProfiles: data.socialProfiles,
          },
          currentUser,
        ),
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
      <div className="flex flex-col items-center justify-center rounded-3xl border border-[#234C6A]/10 bg-[#F8FAFC] py-20">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#234C6A]" />
        <p className="font-semibold text-[#456882]">Loading your profile...</p>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="space-y-7">
        <div className="flex flex-col gap-4 rounded-3xl border border-[#234C6A]/10 bg-[#F8FAFC] p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#456882]">
              Profile Control
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-[#234C6A]">
              Your Professional Profile
            </h2>
            <p className="mt-1 text-sm font-medium text-[#456882]">
              Keep the details aligned, complete, and recruiter-ready.
            </p>
          </div>
          {editing ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={toggleEdit}
                className="h-11 rounded-2xl border-[#234C6A]/20 px-5 font-black text-[#234C6A] transition-all hover:-translate-y-0.5 hover:bg-[#234C6A]/5"
                disabled={isSaving}
              >
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                className="h-11 rounded-2xl bg-[#234C6A] px-5 font-black text-white shadow-xl shadow-[#234C6A]/20 transition-all hover:-translate-y-0.5 hover:bg-[#456882]"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          ) : (
            <Button
              onClick={toggleEdit}
              className="h-11 rounded-2xl bg-[#234C6A] px-6 font-black text-white shadow-xl shadow-[#234C6A]/20 transition-all hover:-translate-y-0.5 hover:bg-[#456882]"
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>

        <ProfileHeader
          editing={editing}
          control={methods.control}
          register={methods.register}
          currentUser={currentUser}
          profileData={profileData}
          imagePreview={imageState.preview}
          onImageChange={handleImageChange}
        />

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Left Column: Timeline, Projects, Bio, Skills */}
          <div className="space-y-8">
            <BioSection editing={editing} bio={profileData?.aboutMe || ""} />
            <SkillsSection
              editing={editing}
              profileSkills={profileData?.skills || []}
            />
            <ProjectsSection editing={editing} />
            <ExperienceSection editing={editing} />
            <EducationSection editing={editing} />
          </div>

          {/* Right Column (Sidebar): Stats, Logistics, Presence, Documents */}
          <aside className="space-y-8 lg:sticky lg:top-24">
            <ProfileStrengthIndicator
              strength={calculateProfileStrength(profileData, currentUser)}
            />
            <LogisticsSection editing={editing} />
            <SocialLinksSection editing={editing} />
            <ResumePortfolioSection editing={editing} profileData={profileData} />
          </aside>
        </div>
      </div>
    </FormProvider>
  );
};

export default JobSeekerProfile;
