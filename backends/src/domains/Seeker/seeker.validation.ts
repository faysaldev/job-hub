import { z } from "zod";

const workExperienceSchema = z.object({
  position: z.string().optional(),
  durationFrom: z.string().optional(),
  durationTo: z.string().optional(),
  companyName: z.string().optional(),
  responsibilities: z.array(z.string()).optional(),
});

const educationSchema = z.object({
  school: z.string().optional(),
  degree: z.string().optional(),
  year: z.string().optional(),
});

const resumeSchema = z.object({
  resumeName: z.string().optional(),
  resumeLink: z.string().optional(),
});

const projectSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  live_url: z.string().url().optional().or(z.literal("")),
});

const socialProfilesSchema = z.object({
  linkedin: z.string().optional(),
  github: z.string().optional(),
  twitter: z.string().optional(),
});

export const createSeekerValidation = z.object({
  userLocation: z.string().optional(),
  designation: z.string().optional(),
  aboutMe: z.string().optional(),
  skills: z.array(z.string()).optional(),
  totalExperience: z.string().optional(),
  experienceLevel: z
    .enum(["entry-level", "mid-level", "senior-level", "expert"])
    .optional(),
  availability: z
    .enum(["immediately", "1-week", "2-weeks", "1-month"])
    .optional(),
  jobType: z.enum(["hybrid", "onsite", "remote"]).optional(),
  recentProjects: z.array(projectSchema).optional(),
  workExperiences: z.array(workExperienceSchema).optional(),
  educations: z.array(educationSchema).optional(),
  resume: resumeSchema.optional(),
  portfolio: z.string().optional(),
  socialProfiles: socialProfilesSchema.optional(),
  profileStrength: z.number().min(0).max(100).optional(),
});

export const updateSeekerValidation = z.object({
  userLocation: z.string().optional(),
  designation: z.string().optional(),
  aboutMe: z.string().optional(),
  skills: z.array(z.string()).optional(),
  totalExperience: z.string().optional(),
  experienceLevel: z
    .enum(["entry-level", "mid-level", "senior-level", "expert"])
    .optional(),
  availability: z
    .enum(["immediately", "1-week", "2-weeks", "1-month"])
    .optional(),
  jobType: z.enum(["hybrid", "onsite", "remote"]).optional(),
  recentProjects: z.array(projectSchema).optional(),
  workExperiences: z.array(workExperienceSchema).optional(),
  educations: z.array(educationSchema).optional(),
  resume: resumeSchema.optional(),
  portfolio: z.string().optional(),
  socialProfiles: socialProfilesSchema.optional(),
  profileStrength: z.number().min(0).max(100).optional(),
});

const seekerValidation = {
  createSeekerValidation,
  updateSeekerValidation,
};

export default seekerValidation;
