export interface JobDocument {
  _id?: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  employmentType: string;
  experienceLevel: string;
  postedDate: Date;
  deadline: Date;
  requirements: string[];
  benefits: string[];
  responsibilities: string[];
  createdBy: string; // Reference to the user who created the job
  isActive: boolean;
  applicationUrl?: string;
  tags: string[];
  views: number;
  applications: number;
}