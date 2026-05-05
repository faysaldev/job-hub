import mongoose from 'mongoose';

export interface IWorkExperience {
  position: string;
  durationFrom: string;
  durationTo: string;
  companyName: string;
  responsibilities: string[];
}

export interface IEducation {
  school: string;
  degree: string;
  year: string;
}

export interface IResume {
  resumeName: string;
  resumeLink: string;
}

export interface IProject {
  project_name: string;
  description: string;
  live_url?: string;
}

export interface ISocialProfiles {
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface ISeeker extends Document {
  userId: mongoose.Types.ObjectId;
  userLocation?: string;
  designation?: string;
  aboutMe?: string;
  skills: string[];
  totalExperience?: string;
  experienceLevel?: "entry-level" | "mid-level" | "senior-level" | "expert";
  availability?: "immediately" | "1-week" | "2-weeks" | "1-month";
  jobType?: "hybrid" | "onsite" | "remote";
  recentProjects: IProject[];
  workExperiences: IWorkExperience[];
  educations: IEducation[];
  resume?: IResume;
  portfolio?: string;
  socialProfiles?: ISocialProfiles;
  profileStrength?: number;
  createdAt: Date;
  updatedAt: Date;
}

const workExperienceSchema = new mongoose.Schema({
  position: { type: String, required: true },
  durationFrom: { type: String, required: true },
  durationTo: { type: String, required: true },
  companyName: { type: String, required: true },
  responsibilities: [{ type: String }],
});

const educationSchema = new mongoose.Schema({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  year: { type: String, required: true },
});

const resumeSchema = new mongoose.Schema({
  resumeName: { type: String },
  resumeLink: { type: String },
});

const projectSchema = new mongoose.Schema({
  project_name: { type: String, required: true },
  description: { type: String, required: true },
  live_url: { type: String },
});

const socialProfilesSchema = new mongoose.Schema({
  linkedin: { type: String },
  github: { type: String },
  twitter: { type: String },
});

const seekerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    userLocation: { type: String },
    designation: { type: String },
    aboutMe: { type: String },
    skills: [{ type: String }],
    totalExperience: { type: String },
    experienceLevel: {
      type: String,
      enum: ["entry-level", "mid-level", "senior-level", "expert"],
    },
    availability: {
      type: String,
      enum: ["immediately", "1-week", "2-weeks", "1-month"],
    },
    jobType: {
      type: String,
      enum: ["hybrid", "onsite", "remote"],
    },
    recentProjects: [projectSchema],
    workExperiences: [workExperienceSchema],
    educations: [educationSchema],
    resume: resumeSchema,
    portfolio: { type: String },
    socialProfiles: socialProfilesSchema,
    profileStrength: { type: Number, default: 0, min: 0, max: 100 },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ISeeker>("Seeker", seekerSchema);
