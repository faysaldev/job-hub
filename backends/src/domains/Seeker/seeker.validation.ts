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

const socialProfilesSchema = z.object({
  linkedin: z.string().optional(),
  github: z.string().optional(),
});

export const createSeekerValidation = z.object({
  userLocation: z.string().optional(),
  designation: z.string().optional(),
  aboutMe: z.string().optional(),
  skills: z.array(z.string()).optional(),
  workExperiences: z.array(workExperienceSchema).optional(),
  educations: z.array(educationSchema).optional(),
  resume: resumeSchema.optional(),
  portfolio: z.string().optional(),
  socialProfiles: socialProfilesSchema.optional(),
});

export const updateSeekerValidation = z.object({
  userLocation: z.string().optional(),
  designation: z.string().optional(),
  aboutMe: z.string().optional(),
  skills: z.array(z.string()).optional(),
  workExperiences: z.array(workExperienceSchema).optional(),
  educations: z.array(educationSchema).optional(),
  resume: resumeSchema.optional(),
  portfolio: z.string().optional(),
  socialProfiles: socialProfilesSchema.optional(),
});

const seekerValidation = {
  createSeekerValidation,
  updateSeekerValidation,
};

export default seekerValidation;
