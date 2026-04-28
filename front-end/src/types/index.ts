// ============================================================================
// CORE ENTITY TYPES — JobHub
// ============================================================================

// ---------- Auth & Users ----------

export type UserRole = "jobseeker" | "recruiter" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  phoneNumber?: string;
  isProfileCompleted: boolean;
  isVerified: boolean;
  createdAt: string;
}

// ---------- Job Seeker ----------

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  location?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Portfolio {
  id: string;
  title: string;
  url: string;
  description?: string;
  imageUrl?: string;
}

export interface JobSeekerProfile {
  userId: string;
  headline?: string;
  bio: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  portfolio?: Portfolio[];
  resume?: string;
  phone?: string;
  location?: string;
  city?: string;
  country?: string;
  profileImage?: string;
  linkedIn?: string;
  github?: string;
  website?: string;
  openToWork: boolean;
  preferredJobTypes?: JobType[];
  preferredLocations?: string[];
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  profileCompletionPercent?: number;
  updatedAt: string;
}

// ---------- Recruiter / Company ----------

export type CompanySize =
  | "1-10"
  | "11-50"
  | "51-200"
  | "201-500"
  | "501-1000"
  | "1000+";

export interface CompanyProfile {
  userId: string;
  companyName: string;
  industry: string;
  companySize: CompanySize;
  website?: string;
  description: string;
  logo?: string;
  coverImage?: string;
  location: string;
  city?: string;
  country?: string;
  foundedYear?: number;
  linkedIn?: string;
  twitter?: string;
  benefits?: string[];
  culture?: string;
  verifiedAt?: string;
  updatedAt?: string;
}

// ---------- Jobs ----------

export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship" | "Freelance" | "Remote";
export type ExperienceLevel = "Entry Level" | "Mid Level" | "Senior Level" | "Lead/Principal" | "Executive";
export type JobStatus = "draft" | "active" | "closed" | "expired";

export interface Job {
  id: string | number;
  recruiterId?: string;
  companyId?: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  remote?: boolean;
  type: JobType | string;
  experienceLevel?: ExperienceLevel | string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: "year" | "month" | "hour";
  salary?: string; // formatted string e.g. "$80k - $120k"
  description: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  skills: string[];
  category?: string;
  subcategory?: string;
  status: JobStatus | string;
  applicationCount?: number;
  viewCount?: number;
  deadline?: string;
  posted?: string;    // legacy alias
  postedAt?: string;
  updatedAt?: string;
  expiresAt?: string;
  isSaved?: boolean;
  isApplied?: boolean;
}

// ---------- Applications ----------

export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "interview_scheduled"
  | "offer_sent"
  | "hired"
  | "rejected"
  | "withdrawn";

export interface Application {
  id: string;
  jobId: string;
  jobSeekerId: string;
  jobSeekerName: string;
  jobSeekerEmail?: string;
  jobSeekerProfileImage?: string;
  jobTitle: string;
  companyName: string;
  status: ApplicationStatus;
  appliedDate: string;
  updatedAt?: string;
  coverLetter?: string;
  resumeUrl?: string;
  profileUrl?: string;
  answers?: Record<string, string>; // custom application questions
  notes?: string; // recruiter internal notes
  paymentAmount?: number; // application boost payment
  interviewDate?: string;
}

// ---------- Messaging ----------

export type MessageType = "text" | "file" | "scheduling" | "system";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  content: string;
  type: MessageType;
  attachments?: Attachment[];
  schedulingData?: SchedulingData;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  deletedAt?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface SchedulingData {
  date: string;
  time: string;
  type: "video" | "phone" | "in-person";
  location?: string;
  meetingUrl?: string;
  confirmed?: boolean;
  confirmedAt?: string;
}

export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  jobId?: string;
  jobTitle?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  lastMessageSenderId?: string;
  unreadCount: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationParticipant {
  userId: string;
  name: string;
  avatar?: string;
  role: UserRole;
  isOnline?: boolean;
  lastSeenAt?: string;
}

// ---------- Notifications ----------

export type NotificationType =
  | "application_received"
  | "application_status_change"
  | "interview_scheduled"
  | "interview_reminder"
  | "message_received"
  | "job_match"
  | "profile_view"
  | "offer_received"
  | "job_expiring"
  | "system";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  imageUrl?: string;
  isRead: boolean;
  readAt?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ---------- Saved Jobs ----------

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  job?: Job;
  savedAt: string;
}

// ---------- Analytics ----------

export interface RecruiterAnalytics {
  period: string;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newApplications: number;
  shortlisted: number;
  hired: number;
  rejectionRate: number;
  averageTimeToHire: number; // days
  profileViews: number;
  topSkillsInDemand: { skill: string; count: number }[];
  applicationsOverTime: { date: string; count: number }[];
}

export interface JobSeekerAnalytics {
  totalApplications: number;
  pendingApplications: number;
  interviews: number;
  offers: number;
  profileViews: number;
  savedJobs: number;
  applicationSuccessRate: number;
  applicationsByStatus: Record<ApplicationStatus, number>;
  activityOverTime: { date: string; count: number }[];
}

// ---------- Pagination & Filters ----------

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface JobFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  location?: string;
  remote?: boolean;
  type?: JobType | JobType[];
  experienceLevel?: ExperienceLevel | ExperienceLevel[];
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  postedWithin?: "24h" | "7d" | "30d" | "90d";
  sortBy?: "relevance" | "newest" | "salary_high" | "salary_low";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ---------- API Response Wrapper ----------

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  code: number;
}

export interface ApiError {
  success: false;
  message: string;
  code: number;
  errors?: Record<string, string[]>;
}

// ---------- Static types ----------

export interface StaticStats {
  label: string;
  value: string;
  icon?: string;
}
