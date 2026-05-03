import Application from "./application.model";

// Create a new application
const createApplication = async (applicationData: {
  cover_letter?: string;
  resume_url: string;
  applicant: string;
  job_id: string;
  paid_amount?: number;
}) => {
  const application = new Application(applicationData);
  const savedApplication = await application.save();
  
  // Logic to notify recruiter should be here or in controller
  // For now, just fix the return
  return savedApplication;
};

// Get all applications (optionally filtered by user or job)
const getApplications = async (filters: any = {}) => {
  return await Application.find(filters)
    .populate("applicant", "name email")
    .populate("job_id", "job_title company_name")
    .sort({ paid_amount: -1, createdAt: -1 });
};

// Get application by ID
const getApplicationById = async (id: string) => {
  return await Application.findById(id)
    .populate("applicant", "name email")
    .populate("job_id", "job_title company_name");
};

// Update application status
const updateApplicationStatus = async (id: string, status: string) => {
  const validStatuses = [
    "applied",
    "under_review",
    "interview",
    "rejected",
    "hired",
  ];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status value");
  }

  return await Application.findByIdAndUpdate(id, { status }, { new: true })
    .populate("applicant", "name email")
    .populate("job_id", "job_title company_name");
};

// Delete application
const deleteApplication = async (id: string) => {
  return await Application.findByIdAndDelete(id);
};

// Get applications by applicant (user)
const getApplicationsByApplicant = async (applicantId: string) => {
  return await Application.find({
    applicant: applicantId,
  }).populate("job_id", "title company");
};

// Get applications for a specific job
const getApplicationsForJob = async (jobId: string) => {
  return await Application.find({ job_id: jobId })
    .populate("applicant", "name email")
    .sort({ paid_amount: -1, createdAt: -1 });
};

const applicationService = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getApplicationsByApplicant,
  getApplicationsForJob,
};

export default applicationService;
