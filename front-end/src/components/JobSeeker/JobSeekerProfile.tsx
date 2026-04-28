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

        <ProfileHeader
          editing={editing}
          control={methods.control}
          register={methods.register}
          currentUser={currentUser}
          profileData={profileData}
          imagePreview={imageState.preview}
          onImageChange={handleImageChange}
        />

        <BioSection editing={editing} bio={profileData?.aboutMe || ""} />
        <SkillsSection
          editing={editing}
          profileSkills={profileData?.skills || []}
        />
        <ExperienceSection editing={editing} />
        <EducationSection editing={editing} />
        <ResumePortfolioSection editing={editing} profileData={profileData} />
      </div>
    </FormProvider>
  );
};

export default JobSeekerProfile;

// --------------TODO: section previous -------------

// "use client";

// import { useState, useEffect } from "react";
// import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
// import { Card } from "@/src/components/ui/card";
// import { Button } from "@/src/components/ui/button";
// import { Input } from "@/src/components/ui/input";
// import { Badge } from "@/src/components/ui/badge";
// import {
//   User,
//   Mail,
//   MapPin,
//   Briefcase,
//   GraduationCap,
//   ExternalLink,
//   Plus,
//   Trash2,
//   Save,
//   X,
//   Loader2,
//   Sparkles,
//   Clock,
//   CloudCog,
//   Phone,
// } from "lucide-react";
// import { cn } from "@/src/lib/utils";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import PhoneInput from 'react-phone-number-input';
// import 'react-phone-number-input/style.css';
// import Select from 'react-select';
// import { Country, City } from 'country-state-city';
// import {
//   useGetSeekerProfileQuery,
//   useCreateSeekerProfileMutation,
//   useUpdateSeekerProfileMutation,
// } from "@/src/redux/features/seeker/seekerApi";
// import { useUpdateProfileMutation } from "@/src/redux/features/user/userApi";
// import { useAppSelector, useAppDispatch } from "@/src/redux/hooks";
// import {
//   selectCurrentUser,
//   selectToken,
//   setUser,
// } from "@/src/redux/features/auth/authSlice";
// import { toast } from "sonner";
// import {
//   Experience,
//   Education,
//   JobSeekerProfile as TJobSeekerProfile,
// } from "@/src/types";
// import { useRef } from "react";
// import { Camera } from "lucide-react";

// type ProfileFormValues = {
//   name: string;
//   phoneNumber: string;
//   headline: string;
//   bio: string;
//   location: string;
//   website: string;
//   resume: string;
//   skills: string[];
//   experience: Experience[];
//   education: Education[];
// };

// interface JobSeekerProfileProps {
//   userId: string;
// }

// const JobSeekerProfile = ({ userId }: JobSeekerProfileProps) => {
//   const [editing, setEditing] = useState(false);
//   const [newSkill, setNewSkill] = useState("");
//   const currentUser = useAppSelector(selectCurrentUser);
//   const token = useAppSelector(selectToken);
//   const dispatch = useAppDispatch();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const { data: profileResponse, isLoading: isFetching } =
//     useGetSeekerProfileQuery();
//   const [createProfile, { isLoading: isCreating }] =
//     useCreateSeekerProfileMutation();
//   const [updateSeekerProfile, { isLoading: isUpdatingSeeker }] =
//     useUpdateSeekerProfileMutation();
//   const [updateUserBasicInfo, { isLoading: isUpdatingUser }] =
//     useUpdateProfileMutation();

//   // Basic User Info State
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   const { control, register, handleSubmit, reset, setValue, getValues, watch, formState: { errors } } = useForm<ProfileFormValues>({
//     defaultValues: {
//       name: "",
//       phoneNumber: "",
//       headline: "",
//       bio: "",
//       location: "",
//       website: "",
//       resume: "",
//       skills: [],
//       experience: [],
//       education: [],
//     }
//   });

//   const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
//     control,
//     name: "experience",
//   });

//   const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
//     control,
//     name: "education",
//   });

//   const watchedSkills = useWatch({
//     control,
//     name: "skills",
//     defaultValue: [],
//   });

//   useEffect(() => {
//     const apiData = profileResponse as any;
//     if (apiData?.data || currentUser) {
//       const data = apiData?.data || {};
//       reset({
//         name: currentUser?.name || "",
//         phoneNumber: currentUser?.phoneNumber || "",
//         headline: data.designation || "",
//         bio: data.aboutMe || "",
//         location: data.userLocation || "",
//         website: data.portfolio || "",
//         resume: data.resume?.resumeLink || "",
//         skills: data.skills || [],
//         experience: data.workExperiences?.map((exp: any) => ({
//           id: exp._id || Math.random().toString(),
//           title: exp.position,
//           company: exp.companyName,
//           startDate: exp.durationFrom,
//           endDate: exp.durationTo === "Present" ? "" : exp.durationTo,
//           current: exp.durationTo === "Present",
//           description: exp.responsibilities?.[0] || "",
//         })) || [],
//         education: data.educations?.map((edu: any) => ({
//           id: edu._id || Math.random().toString(),
//           institution: edu.school,
//           degree: edu.degree,
//           startDate: edu.year?.split(" - ")[0] || "",
//           endDate: edu.year?.split(" - ")[1] === "Present" ? "" : edu.year?.split(" - ")[1],
//           current: edu.year?.includes("Present") || false,
//         })) || [],
//       });
//       if (currentUser?.image) {
//         setImagePreview(currentUser.image);
//       }
//     }
//   }, [profileResponse, currentUser, reset]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const skillInputRef = useRef<HTMLInputElement>(null);
//   const expTitleRef = useRef<HTMLInputElement>(null);
//   const expCompanyRef = useRef<HTMLInputElement>(null);
//   const expStartRef = useRef<any>(null);
//   const expEndRef = useRef<any>(null);
//   const expCurrentRef = useRef<HTMLInputElement>(null);
//   const expDescRef = useRef<HTMLTextAreaElement>(null);

//   const eduDegreeRef = useRef<HTMLInputElement>(null);
//   const eduInstRef = useRef<HTMLInputElement>(null);
//   const eduStartRef = useRef<any>(null);
//   const eduEndRef = useRef<any>(null);
//   const eduCurrentRef = useRef<HTMLInputElement>(null);

//   const [eduCurrent, setEduCurrent] = useState(false);
//   const [expCurrent, setExpCurrent] = useState(false);

//   const addSkill = () => {
//     const value = skillInputRef.current?.value.trim();
//     const currentSkills = getValues("skills") || [];
//     if (value && !currentSkills.includes(value)) {
//       setValue("skills", [...currentSkills, value]);
//       if (skillInputRef.current) skillInputRef.current.value = "";
//     }
//   };

//   const removeSkill = (index: number) => {
//     const currentSkills = getValues("skills") || [];
//     setValue("skills", currentSkills.filter((_: string, i: number) => i !== index));
//   };

//   const toggleEdit = () => {
//     if (editing) {
//       // Revert changes if cancelling
//       reset();
//     }
//     setEditing(!editing);
//   };

//   const onSubmit = async (data: ProfileFormValues) => {
//     try {
//       // 1. Handle User Basic Info Update (Name, Phone & Image)
//       if (data.name !== currentUser?.name || data.phoneNumber !== currentUser?.phoneNumber || selectedImage) {
//         const formData = new FormData();
//         if (data.name !== currentUser?.name) formData.append("name", data.name);
//         if (data.phoneNumber !== currentUser?.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
//         if (selectedImage) formData.append("image", selectedImage);

//         const userUpdateResponse = await updateUserBasicInfo(formData).unwrap();

//         if (userUpdateResponse?.data && token) {
//           const userData = userUpdateResponse.data;
//           dispatch(
//             setUser({
//               user: {
//                 ...userData,
//                 id: userData.id || userData._id,
//               },
//               token,
//             }),
//           );
//         }
//       }

//       // 2. Handle Seeker Profile Update
//       const seekerProfileData = {
//         userLocation: data.location,
//         designation: data.headline,
//         aboutMe: data.bio,
//         skills: data.skills,
//         workExperiences: data.experience?.map((exp) => ({
//           position: exp.title,
//           durationFrom: exp.startDate,
//           durationTo: exp.current ? "Present" : exp.endDate,
//           companyName: exp.company,
//           responsibilities: [exp.description],
//         })),
//         educations: data.education?.map((edu) => ({
//           school: edu.institution,
//           degree: edu.degree,
//           year: `${edu.startDate} - ${edu.endDate || "Present"}`,
//         })),
//         resume: {
//           resumeName: "Resume",
//           resumeLink: data.resume || "",
//         },
//         portfolio: data.website,
//       };

//       if (profileResponse) {
//         // Update existing profile
//         await updateSeekerProfile(seekerProfileData as any).unwrap();
//         toast.success("Profile updated successfully!");
//       } else {
//         // Create new profile
//         await createProfile(seekerProfileData as any).unwrap();
//         toast.success("Profile created successfully!");
//       }
//       setEditing(false);
//       setSelectedImage(null);
//     } catch (error: any) {
//       console.error("Error saving profile:", error);
//       toast.error(error?.data?.message || "Failed to save profile");
//     }
//   };

//   if (isFetching) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20">
//         <Loader2 className="h-10 w-10 animate-spin text-[#234C6A] mb-4" />
//         <p className="text-[#456882] font-medium">Loading your profile...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-start">
//         <h2 className="text-2xl font-bold text-[#234C6A]">
//           Your Professional Profile
//         </h2>
//         {editing ? (
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               onClick={toggleEdit}
//               className="border-[#456882] text-[#234C6A] hover:bg-[#456882]/10"
//               disabled={isUpdatingSeeker || isCreating || isUpdatingUser}
//             >
//               <X className="h-4 w-4 mr-2" />
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSubmit(onSubmit)}
//               className="bg-[#234C6A] hover:bg-[#456882]"
//               disabled={isUpdatingSeeker || isCreating || isUpdatingUser}
//             >
//               {isUpdatingSeeker || isCreating || isUpdatingUser ? (
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//               ) : (
//                 <Save className="h-4 w-4 mr-2" />
//               )}
//               Save Changes
//             </Button>
//           </div>
//         ) : (
//           <Button
//             onClick={toggleEdit}
//             className="bg-gradient-to-r from-[#234C6A] to-[#456882] text-white shadow-lg hover:shadow-xl rounded-xl px-6"
//           >
//             Edit Profile
//           </Button>
//         )}
//       </div>

//       {/* Profile Header */}
//       <Card className="p-8 border-[#456882]/30 bg-white shadow-xl rounded-2xl overflow-hidden relative">
//         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#234C6A] via-[#456882] to-[#234C6A]"></div>
//         <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
//           <div className="flex-shrink-0 relative group">
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleImageChange}
//               accept="image/*"
//               className="hidden"
//             />
//             <div
//               className={cn(
//                 "bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-3xl p-1 w-32 h-32 flex items-center justify-center shadow-lg transition-all duration-300",
//                 editing
//                   ? "cursor-pointer hover:scale-105"
//                   : "group-hover:scale-105",
//               )}
//               onClick={() => editing && fileInputRef.current?.click()}
//             >
//               <div className="bg-gray-50 border-4 border-white rounded-2xl w-28 h-28 flex items-center justify-center overflow-hidden relative">
//                 {imagePreview ? (
//                   <img
//                     src={imagePreview}
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <User className="h-14 w-14 text-[#234C6A]" />
//                 )}
//                 {editing && (
//                   <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
//                     <Camera className="text-white h-8 w-8" />
//                   </div>
//                 )}
//               </div>
//             </div>
//             {editing && (
//               <Badge
//                 className="absolute -bottom-2 -right-2 bg-white text-[#234C6A] border-[#234C6A]/20 shadow-md cursor-pointer hover:bg-gray-50"
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <Camera className="h-3 w-3 mr-1" /> Change
//               </Badge>
//             )}
//           </div>

//           <div className="flex-1 text-center md:text-left">
//             <div className="space-y-1">
//               {editing ? (
//                 <Input
//                   {...register("name")}
//                   placeholder="Your Full Name"
//                   className="text-2xl font-bold border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A] bg-gray-50 max-w-md h-12"
//                 />
//               ) : (
//                 <h3 className="text-3xl font-extrabold text-[#234C6A]">
//                   {(profileResponse as any)?.data?.userId?.name || currentUser?.name}
//                 </h3>
//               )}
//               {editing ? (
//                 <Input
//                   {...register("headline")}
//                   placeholder="Professional Headline (e.g. Senior Frontend Developer)"
//                   className="mt-2 text-lg border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A] bg-gray-50"
//                 />
//               ) : (
//                 <p className="text-xl text-[#456882] font-medium italic">
//                   {(profileResponse as any)?.data?.designation || "No headline set"}
//                 </p>
//               )}
//             </div>

//             <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-[#456882] mt-4 font-medium">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 bg-[#234C6A]/10 rounded-lg">
//                   <Mail className="h-4 w-4 text-[#234C6A]" />
//                 </div>
//                 <span>{currentUser?.email}</span>
//               </div>

//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 bg-[#234C6A]/10 rounded-lg">
//                   <Phone className="h-4 w-4 text-[#234C6A]" />
//                 </div>
//                 {editing ? (
//                    <Controller
//                     control={control}
//                     name="phoneNumber"
//                     render={({ field }) => (
//                       <PhoneInput
//                         placeholder="Enter phone number"
//                         {...field}
//                         className="flex h-8 w-full rounded-md border border-[#456882]/30 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234C6A]"
//                       />
//                     )}
//                   />
//                 ) : (
//                   <span>{(profileResponse as any)?.data?.userId?.phoneNumber || "No phone added"}</span>
//                 )}
//               </div>

//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 bg-[#234C6A]/10 rounded-lg">
//                   <MapPin className="h-4 w-4 text-[#234C6A]" />
//                 </div>
//                  {editing ? (
//                   <div className="flex-1 min-w-[200px]">
//                     <Controller
//                       control={control}
//                       name="location"
//                       render={({ field: { value, onChange } }) => (
//                         <Select
//                           className="text-sm"
//                           placeholder="Search City..."
//                           isClearable
//                           options={City.getAllCities().map(city => ({
//                             value: `${city.name}, ${city.countryCode}`,
//                             label: `${city.name}, ${city.countryCode}`
//                           }))}
//                           value={value ? { value, label: value } : null}
//                           onChange={(opt) => onChange(opt ? (opt as any).value : "")}
//                           styles={{
//                             control: (base) => ({
//                               ...base,
//                               borderColor: '#4568824d',
//                               borderRadius: '0.75rem',
//                               minHeight: '32px',
//                             }),
//                           }}
//                         />
//                       )}
//                     />
//                   </div>
//                 ) : (
//                   <span>{(profileResponse as any)?.data?.userLocation || "Location not set"}</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </Card>

//       {/* Bio Section */}
//       <Card className="p-8 border-[#456882]/30 bg-white shadow-lg rounded-2xl">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="p-2 bg-[#234C6A]/10 rounded-xl">
//             <User className="h-5 w-5 text-[#234C6A]" />
//           </div>
//           <h3 className="text-xl font-bold text-[#234C6A]">About Me</h3>
//         </div>

//         {editing ? (
//           <textarea
//             {...register("bio")}
//             placeholder="Write a brief professional summary about yourself..."
//             className="w-full min-h-[150px] p-4 border border-[#456882]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234C6A] focus:border-[#234C6A] bg-gray-50"
//           />
//         ) : (
//           <p className="text-[#234C6A]/90 leading-relaxed text-lg">
//             {(profileResponse as any)?.data?.aboutMe || "No bio added yet. Tell us about your journey!"}
//           </p>
//         )}
//       </Card>

//       {/* Skills Section */}
//       <Card className="p-8 border-[#456882]/30 bg-white shadow-lg rounded-2xl">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="p-2 bg-[#234C6A]/10 rounded-xl">
//             <Sparkles className="h-5 w-5 text-[#234C6A]" />
//           </div>
//           <h3 className="text-xl font-bold text-[#234C6A]">
//             Skills & Expertise
//           </h3>
//         </div>

//         {editing ? (
//           <div className="space-y-6">
//             <div className="flex flex-wrap gap-3">
//               {watchedSkills?.map((skill: string, index: number) => (
//                 <Badge
//                   key={index}
//                   className="px-4 py-2 text-sm bg-gradient-to-r from-[#234C6A] to-[#456882] text-white border-none shadow-md flex items-center gap-2 group"
//                 >
//                   {skill}
//                   <button
//                     type="button"
//                     onClick={() => removeSkill(index)}
//                     className="hover:text-red-200 transition-colors"
//                   >
//                     <X className="h-3 w-3" />
//                   </button>
//                 </Badge>
//               ))}
//             </div>
//             <div className="flex gap-3">
//               <Input
//                 ref={skillInputRef}
//                 placeholder="Add a skill (e.g. React, UI Design)"
//                 className="flex-1 border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A] h-12 rounded-xl"
//                 onKeyDown={(e) => e.key === "Enter" && addSkill()}
//               />
//               <Button
//                 type="button"
//                 onClick={addSkill}
//                 className="bg-[#234C6A] hover:bg-[#456882] h-12 px-6 rounded-xl"
//               >
//                 <Plus className="h-5 w-5 mr-1" />
//                 Add
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-wrap gap-3">
//             {(profileResponse as any)?.data?.skills && (profileResponse as any)?.data?.skills.length > 0 ? (
//               (profileResponse as any)?.data?.skills.map((skill: string, index: number) => (
//                 <Badge
//                   key={index}
//                   variant="secondary"
//                   className="px-5 py-2.5 text-base bg-[#234C6A]/10 text-[#234C6A] hover:bg-[#234C6A]/20 border-none rounded-xl"
//                 >
//                   {skill}
//                 </Badge>
//               ))
//             ) : (
//               <p className="text-[#456882] italic">No skills added yet.</p>
//             )}
//           </div>
//         )}
//       </Card>

//       {/* Experience Section */}
//       <Card className="p-8 border-[#456882]/30 bg-white shadow-lg rounded-2xl">
//         <div className="flex items-center gap-3 mb-8">
//           <div className="p-2 bg-[#234C6A]/10 rounded-xl">
//             <Briefcase className="h-5 w-5 text-[#234C6A]" />
//           </div>
//           <h3 className="text-xl font-bold text-[#234C6A]">Work Experience</h3>
//         </div>

//         <div className="space-y-8">
//           {experienceFields.map((field, index) => (
//             <div
//               key={field.id}
//               className="group border-l-4 border-gradient-to-b from-[#234C6A] to-[#456882] pl-6 py-1 relative"
//             >
//               {editing && (
//                 <button
//                   type="button"
//                   onClick={() => removeExperience(index)}
//                   className="absolute -right-2 top-0 p-2 text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                 >
//                   <Trash2 className="h-5 w-5" />
//                 </button>
//               )}

//               <div className="space-y-3">
//                 {editing ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-4">
//                       <Input
//                         {...register(`experience.${index}.title`)}
//                         placeholder="Job Title"
//                         className="font-bold text-[#234C6A] border-[#456882]/30 focus:border-[#234C6A]"
//                       />
//                       <Input
//                         {...register(`experience.${index}.company`)}
//                         placeholder="Company"
//                         className="text-[#234C6A]/80 border-[#456882]/30 focus:border-[#234C6A]"
//                       />
//                     </div>
//                     <div className="space-y-4">
//                       <div className="flex items-center gap-2">
//                         <div className="flex-1">
//                           <Controller
//                             control={control}
//                             name={`experience.${index}.startDate`}
//                             render={({ field: { value, onChange } }) => (
//                               <DatePicker
//                                 selected={value ? new Date(value) : null}
//                                 onChange={(date: Date | null) => onChange(date?.toISOString())}
//                                 placeholderText="Start Date"
//                                 dateFormat="MM/yyyy"
//                                 showMonthYearPicker
//                                 className="flex h-10 w-full rounded-md border border-[#456882]/30 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234C6A]"
//                               />
//                             )}
//                           />
//                         </div>
//                         <span className="text-[#456882]">-</span>
//                         <div className="flex-1">
//                           <Controller
//                             control={control}
//                             name={`experience.${index}.endDate`}
//                             render={({ field: { value, onChange } }) => (
//                               <DatePicker
//                                 selected={value ? new Date(value) : null}
//                                 onChange={(date: Date | null) => onChange(date?.toISOString())}
//                                 placeholderText="End Date"
//                                 dateFormat="MM/yyyy"
//                                 showMonthYearPicker
//                                 disabled={watch(`experience.${index}.current`)}
//                                 className="flex h-10 w-full rounded-md border border-[#456882]/30 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234C6A] disabled:opacity-50"
//                               />
//                             )}
//                           />
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="checkbox"
//                           {...register(`experience.${index}.current`)}
//                           id={`current-${field.id}`}
//                           className="rounded border-[#234C6A] text-[#234C6A] focus:ring-[#234C6A]"
//                         />
//                         <label
//                           htmlFor={`current-${field.id}`}
//                           className="text-sm font-medium text-[#456882]"
//                         >
//                           I am currently working here
//                         </label>
//                       </div>
//                     </div>
//                     <div className="md:col-span-2">
//                       <textarea
//                         {...register(`experience.${index}.description`)}
//                         placeholder="Describe your achievements and responsibilities..."
//                         className="w-full p-4 border border-[#456882]/30 rounded-xl focus:ring-[#234C6A] bg-gray-50 min-h-[100px]"
//                       />
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
//                       <h4 className="text-xl font-bold text-[#234C6A]">
//                         {field.title}
//                       </h4>
//                       <div className="flex items-center gap-2 px-3 py-1 bg-[#234C6A]/5 rounded-full text-sm font-semibold text-[#456882]">
//                         <Clock className="h-3.5 w-3.5" />
//                         {field.startDate ? new Date(field.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ""} - {field.current ? "Present" : (field.endDate ? new Date(field.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : "")}
//                       </div>
//                     </div>
//                     <p className="text-lg font-semibold text-[#456882] flex items-center gap-2">
//                       <Briefcase className="h-4 w-4" />
//                       {field.company}
//                     </p>
//                     <p className="text-[#234C6A]/80 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100">
//                       {field.description}
//                     </p>
//                   </>
//                 )}
//               </div>
//             </div>
//           ))}

//           {editing && (
//             <div className="mt-10 p-6 bg-[#E3E3E3]/30 rounded-2xl border-2 border-dashed border-[#456882]/30">
//               <h4 className="text-lg font-bold text-[#234C6A] mb-6 flex items-center gap-2">
//                 <Plus className="h-5 w-5" />
//                 Add New Experience
//               </h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Input
//                   ref={expTitleRef}
//                   placeholder="Job Title (e.g. Senior Product Designer)"
//                   className="border-[#456882]/30"
//                 />
//                 <Input
//                   ref={expCompanyRef}
//                   placeholder="Company Name"
//                   className="border-[#456882]/30"
//                 />
//                 <div className="flex flex-col gap-4">
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={expCurrent}
//                       onChange={(e) => setExpCurrent(e.target.checked)}
//                       id="new-current"
//                       className="rounded border-[#234C6A] text-[#234C6A] focus:ring-[#234C6A]"
//                     />
//                     <label
//                       htmlFor="new-current"
//                       className="text-sm font-medium text-[#456882]"
//                     >
//                       I am currently working here
//                     </label>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="flex-1">
//                       <DatePicker
//                         ref={expStartRef}
//                         placeholderText="Start Date"
//                         dateFormat="MM/yyyy"
//                         showMonthYearPicker
//                         onChange={() => {}} // Controlled via ref for optimization
//                         className="flex h-10 w-full rounded-md border border-[#456882]/30 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234C6A]"
//                       />
//                     </div>
//                     <span className="text-[#456882]">-</span>
//                     <div className="flex-1">
//                       <DatePicker
//                         ref={expEndRef}
//                         placeholderText="End Date"
//                         dateFormat="MM/yyyy"
//                         showMonthYearPicker
//                         disabled={expCurrent}
//                         onChange={() => {}}
//                         className="flex h-10 w-full rounded-md border border-[#456882]/30 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234C6A] disabled:opacity-50"
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="md:col-span-2">
//                   <textarea
//                     ref={expDescRef}
//                     placeholder="Describe your achievements and responsibilities..."
//                     className="w-full p-4 border border-[#456882]/30 rounded-xl focus:ring-[#234C6A] bg-gray-50 min-h-[100px]"
//                   />
//                 </div>
//                 <Button
//                   type="button"
//                   onClick={() => {
//                     const title = expTitleRef.current?.value;
//                     const company = expCompanyRef.current?.value;
//                     if (title && company) {
//                       appendExperience({
//                         id: Math.random().toString(36).substr(2, 9),
//                         title,
//                         company,
//                         startDate: (expStartRef.current as any)?.state?.selectedDate?.toISOString() || "",
//                         endDate: expCurrent ? "" : (expEndRef.current as any)?.state?.selectedDate?.toISOString() || "",
//                         current: expCurrent,
//                         description: expDescRef.current?.value || "",
//                       });
//                       // Reset refs
//                       if (expTitleRef.current) expTitleRef.current.value = "";
//                       if (expCompanyRef.current) expCompanyRef.current.value = "";
//                       if (expDescRef.current) expDescRef.current.value = "";
//                     } else {
//                       toast.error("Please fill in at least company and position");
//                     }
//                   }}
//                   className="bg-[#234C6A] hover:bg-[#456882] rounded-xl px-8"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add to Profile
//                 </Button>
//               </div>
//             </div>
//           )}

//           {!editing &&
//             (!experienceFields || experienceFields.length === 0) && (
//               <p className="text-[#456882] italic text-center py-6 bg-gray-50 rounded-xl">
//                 No work experience added yet.
//               </p>
//             )}
//         </div>
//       </Card>

//       {/* Education Section */}
//       <Card className="p-8 border-[#456882]/30 bg-white shadow-lg rounded-2xl">
//         <div className="flex items-center gap-3 mb-8">
//           <div className="p-2 bg-[#234C6A]/10 rounded-xl">
//             <GraduationCap className="h-5 w-5 text-[#234C6A]" />
//           </div>
//           <h3 className="text-xl font-bold text-[#234C6A]">Education</h3>
//         </div>

//         <div className="space-y-8">
//           {educationFields.map((field, index) => (
//             <div
//               key={field.id}
//               className="group border-l-4 border-amber-400 pl-6 py-1 relative"
//             >
//               {editing && (
//                 <button
//                   type="button"
//                   onClick={() => removeEducation(index)}
//                   className="absolute -right-2 top-0 p-2 text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                 >
//                   <Trash2 className="h-5 w-5" />
//                 </button>
//               )}

//               <div className="space-y-2">
//                 {editing ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <Input
//                       {...register(`education.${index}.degree`)}
//                       placeholder="Degree/Certificate"
//                       className="font-bold border-[#456882]/30"
//                     />
//                     <Input
//                       {...register(`education.${index}.institution`)}
//                       placeholder="School/University"
//                       className="border-[#456882]/30"
//                     />
//                     <div className="flex flex-col gap-4">
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="checkbox"
//                           {...register(`education.${index}.current`)}
//                           id={`edu-current-${field.id}`}
//                           className="rounded border-[#234C6A] text-[#234C6A] focus:ring-[#234C6A]"
//                         />
//                         <label htmlFor={`edu-current-${field.id}`} className="text-sm font-medium text-[#456882]">I am still studying here</label>
//                       </div>
//                       <div className="grid grid-cols-2 gap-4">
//                         <Controller
//                           control={control}
//                           name={`education.${index}.startDate`}
//                           render={({ field: { value, onChange } }) => (
//                             <DatePicker
//                               selected={value ? new Date(value) : null}
//                               onChange={(date: Date | null) => onChange(date?.toISOString())}
//                               placeholderText="Start Date"
//                               dateFormat="MM/yyyy"
//                               showMonthYearPicker
//                               className="flex h-10 w-full rounded-md border border-[#456882]/30 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234C6A]"
//                             />
//                           )}
//                         />
//                         <Controller
//                           control={control}
//                           name={`education.${index}.endDate`}
//                           render={({ field: { value, onChange } }) => (
//                             <DatePicker
//                               selected={value ? new Date(value) : null}
//                               onChange={(date: Date | null) => onChange(date?.toISOString())}
//                               placeholderText="End Date"
//                               dateFormat="MM/yyyy"
//                               showMonthYearPicker
//                               disabled={watch(`education.${index}.current`)}
//                               className="flex h-10 w-full rounded-md border border-[#456882]/30 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234C6A] disabled:opacity-50"
//                             />
//                           )}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
//                       <h4 className="text-xl font-bold text-[#234C6A]">
//                         {field.degree}
//                       </h4>
//                       <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-bold">
//                         {field.startDate ? new Date(field.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ""} - {field.current ? "Present" : (field.endDate ? new Date(field.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : "")}
//                       </span>
//                     </div>
//                     <p className="text-lg font-medium text-[#456882] italic">
//                       {field.institution}
//                     </p>
//                   </>
//                 )}
//               </div>
//             </div>
//           ))}

//           {editing && (
//             <div className="mt-10 p-6 bg-amber-50/30 rounded-2xl border-2 border-dashed border-amber-200">
//               <h4 className="text-lg font-bold text-[#234C6A] mb-6 flex items-center gap-2">
//                 <Plus className="h-5 w-5" />
//                 Add New Education
//               </h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Input
//                   ref={eduDegreeRef}
//                   placeholder="Degree (e.g. B.S. Computer Science)"
//                   className="border-[#456882]/30"
//                 />
//                 <Input
//                   ref={eduInstRef}
//                   placeholder="School/University"
//                   className="border-[#456882]/30"
//                 />
//                 <div className="flex flex-col gap-4">
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={eduCurrent}
//                       onChange={(e) => setEduCurrent(e.target.checked)}
//                       id="new-edu-current"
//                       className="rounded border-[#234C6A] text-[#234C6A] focus:ring-[#234C6A]"
//                     />
//                     <label htmlFor="new-edu-current" className="text-sm font-medium text-[#456882]">I am still studying here</label>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="flex-1">
//                       <DatePicker
//                         ref={eduStartRef}
//                         placeholderText="Start Date"
//                         dateFormat="MM/yyyy"
//                         showMonthYearPicker
//                         onChange={() => {}}
//                         className="flex h-10 w-full rounded-md border border-[#456882]/30 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234C6A]"
//                       />
//                     </div>
//                     <span className="text-[#456882]">-</span>
//                     <div className="flex-1">
//                       <DatePicker
//                         ref={eduEndRef}
//                         placeholderText="End Date"
//                         dateFormat="MM/yyyy"
//                         showMonthYearPicker
//                         disabled={eduCurrent}
//                         onChange={() => {}}
//                         className="flex h-10 w-full rounded-md border border-[#456882]/30 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234C6A] disabled:opacity-50"
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="md:col-span-2">
//                   <Button
//                     type="button"
//                     onClick={() => {
//                       const institution = eduInstRef.current?.value;
//                       const degree = eduDegreeRef.current?.value;
//                       if (institution && degree) {
//                         appendEducation({
//                           id: Math.random().toString(36).substr(2, 9),
//                           institution,
//                           degree,
//                           startDate: (eduStartRef.current as any)?.state?.selectedDate?.toISOString() || "",
//                           endDate: eduCurrent ? "" : (eduEndRef.current as any)?.state?.selectedDate?.toISOString() || "",
//                           current: eduCurrent,
//                         });
//                         if (eduInstRef.current) eduInstRef.current.value = "";
//                         if (eduDegreeRef.current) eduDegreeRef.current.value = "";
//                       } else {
//                         toast.error("Please fill in school and degree");
//                       }
//                     }}
//                     className="bg-amber-500 hover:bg-amber-600 rounded-xl px-8"
//                   >
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add Education
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {!editing &&
//             (!educationFields || educationFields.length === 0) && (
//               <p className="text-[#456882] italic text-center py-6 bg-gray-50 rounded-xl">
//                 No education added yet.
//               </p>
//             )}
//         </div>
//       </Card>

//       {/* Resume & Portfolio */}
//       <Card className="p-8 border-[#456882]/30 bg-white shadow-lg rounded-2xl">
//         <div className="flex items-center gap-3 mb-8">
//           <div className="p-2 bg-[#234C6A]/10 rounded-xl">
//             <ExternalLink className="h-5 w-5 text-[#234C6A]" />
//           </div>
//           <h3 className="text-xl font-bold text-[#234C6A]">
//             Documents & Professional Links
//           </h3>
//         </div>

//         {editing ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-[#234C6A]">
//                 Resume URL (Google Drive/Dropbox)
//               </label>
//               <Input
//                 {...register("resume")}
//                 placeholder="https://..."
//                 className="border-[#456882]/30 rounded-xl h-12"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-[#234C6A]">
//                 Personal Website/Portfolio
//               </label>
//               <Input
//                 {...register("website")}
//                 placeholder="https://yourportfolio.com"
//                 className="border-[#456882]/30 rounded-xl h-12"
//               />
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Button
//               variant="outline"
//               onClick={() =>
//                 watch("resume") && window.open(watch("resume"), "_blank")
//               }
//               className="h-16 flex items-center justify-start gap-4 border-2 border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/5 rounded-2xl group transition-all"
//               disabled={!(profileResponse as any)?.data?.resume?.resumeLink}
//             >
//               <div className="w-10 h-10 rounded-xl bg-[#234C6A] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
//                 <Mail className="h-5 w-5" />
//               </div>
//               <div className="text-left">
//                 <p className="font-bold">View Resume</p>
//                 <p className="text-xs text-[#456882]">
//                   {(profileResponse as any)?.data?.resume?.resumeLink ? "External Link" : "No resume uploaded"}
//                 </p>
//               </div>
//               <ExternalLink className="h-4 w-4 ml-auto opacity-50" />
//             </Button>

//             <Button
//               variant="outline"
//               onClick={() =>
//                 (profileResponse as any)?.data?.portfolio && window.open((profileResponse as any)?.data?.portfolio, "_blank")
//               }
//               className="h-16 flex items-center justify-start gap-4 border-2 border-[#456882] text-[#234C6A] hover:bg-[#456882]/5 rounded-2xl group transition-all"
//               disabled={!(profileResponse as any)?.data?.portfolio}
//             >
//               <div className="w-10 h-10 rounded-xl bg-[#456882] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
//                 <Briefcase className="h-5 w-5" />
//               </div>
//               <div className="text-left">
//                 <p className="font-bold">Portfolio Website</p>
//                 <p className="text-xs text-[#456882]">
//                   {(profileResponse as any)?.data?.portfolio ? "Visit site" : "No link added"}
//                 </p>
//               </div>
//               <ExternalLink className="h-4 w-4 ml-auto opacity-50" />
//             </Button>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default JobSeekerProfile;
