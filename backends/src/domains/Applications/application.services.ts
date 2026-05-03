import mongoose from "mongoose";
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
const updateApplicationStatus = async (
  id: string,
  status: string,
  rejection_note?: string,
) => {
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

  const updateData: any = { status };
  if (rejection_note) updateData.rejection_note = rejection_note;

  return await Application.findByIdAndUpdate(id, updateData, { new: true })
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
  })
    .populate({
      path: "job_id",
      select: "title company type author",
      populate: {
        path: "company",
        select: "companyName companyLogo",
      },
    })
    .sort({ createdAt: -1 });
};

// Get applications for a specific job
const getApplicationsForJob = async (jobId: string) => {
  return await Application.find({ job_id: jobId })
    .populate("applicant", "name email")
    .sort({ paid_amount: -1, createdAt: -1 });
};

// Get applications for jobs owned by a recruiter
const getRecruiterApplications = async (
  recruiterId: string,
  filters: any = {},
) => {
  const Job = mongoose.model("Job");
  const recruiterJobs = await Job.find({ author: recruiterId }).select("_id");
  const jobIds = recruiterJobs.map((job) => job._id);

  const query: any = { job_id: { $in: jobIds } };

  if (filters.status) query.status = filters.status;

  return await Application.find(query)
    .populate("applicant", "name email image")
    .populate("job_id", "title location type")
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
  getRecruiterApplications,
};

export default applicationService;
