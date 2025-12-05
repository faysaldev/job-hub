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

export interface ISocialProfiles {
  linkedin?: string;
  github?: string;
}

export interface ISeeker extends Document {
  userId: mongoose.Types.ObjectId;
  userLocation?: string;
  designation?: string;
  aboutMe?: string;
  skills: string[];
  workExperiences: IWorkExperience[];
  educations: IEducation[];
  resume?: IResume;
  portfolio?: string;
  socialProfiles?: ISocialProfiles;
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

const socialProfilesSchema = new mongoose.Schema({
  linkedin: { type: String },
  github: { type: String },
});

const seekerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  userLocation: { type: String },
  designation: { type: String },
  aboutMe: { type: String },
  skills: [{ type: String }],
  workExperiences: [workExperienceSchema],
  educations: [educationSchema],
  resume: resumeSchema,
  portfolio: { type: String },
  socialProfiles: socialProfilesSchema,
}, {
  timestamps: true
});

export default mongoose.model<ISeeker>('Seeker', seekerSchema);