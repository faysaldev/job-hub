import Job from "./job.model";
import { IJob } from "./job.model";

// Get all jobs with optional filters
const getAllJobs = async (filters: any = {}) => {
  return await Job.find(filters);
};

// Get job by ID
const getJobById = async (jobId: string) => {
  return await Job.findById(jobId);
};

// Create a new job
const createJob = async (jobData: Partial<IJob>) => {
  const job = new Job(jobData);
  return await job.save();
};

// Update job by ID
const updateJob = async (jobId: string, updateData: Partial<IJob>) => {
  return await Job.findByIdAndUpdate(jobId, updateData, { new: true });
};

// Delete job by ID
const deleteJob = async (jobId: string) => {
  return await Job.findByIdAndDelete(jobId);
};

// Get jobs by type (full-time, part-time, etc.)
const getJobsByType = async (jobType: string) => {
  return await Job.find({ job_type: jobType });
};

// Get jobs by experience level
const getJobsByExperience = async (experienceLevel: string) => {
  return await Job.find({ experience: experienceLevel });
};

// Search jobs by title, description, or requirements
const searchJobs = async (searchTerm: string) => {
  const searchRegex = new RegExp(searchTerm, "i");
  return await Job.find({
    $or: [
      { job_title: searchRegex },
      { description: searchRegex },
      { requirements: { $in: [searchRegex] } },
    ],
  });
};

// Seed database with dummy jobs
const seedJobs = async (jobs: Partial<IJob>[]) => {
  try {
    // Clear existing jobs
    await Job.deleteMany({});

    // Insert dummy jobs
    const createdJobs = await Job.insertMany(jobs);
    return createdJobs;
  } catch (error) {
    throw error;
  }
};

const jobService = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobsByType,
  getJobsByExperience,
  searchJobs,
  seedJobs,
};

export default jobService;
