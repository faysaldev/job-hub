export interface JobSeekerProfile {
  userId: string;
  bio: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  resume?: string;
  phone?: string;
  location?: string;
  profileImage?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CompanyProfile {
  userId: string;
  companyName: string;
  industry: string;
  companySize: string;
  website?: string;
  description: string;
  logo?: string;
  location: string;
}

export interface Job {
  id: string;
  recruiterId: string;
  companyName: string;
  title: string;
  description: string;
  skills: string[];
  experience: string;
  location: string;
  type: string;
  salary: string;
  salaryMin: number;
  salaryMax: number;
  deadline: string;
  postedDate: string;
  status: "active" | "closed";
}

export interface Application {
  id: string;
  jobId: string;
  jobSeekerId: string;
  jobSeekerName: string;
  jobTitle: string;
  companyName: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected";
  appliedDate: string;
  coverLetter?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}
