import { IJob } from "./job.model";

export const dummyJobs: Partial<IJob>[] = [
  {
    job_title: "Software Engineer",
    job_type: "full-time",
    location: "remote",
    experience: "mid",
    salary: 90000,
    description: "We are looking for a skilled Software Engineer with experience in TypeScript and Node.js.",
    requirements: [
      "3+ years of experience in software development",
      "Proficiency in TypeScript and JavaScript",
      "Experience with Node.js and Express",
      "Knowledge of MongoDB or similar databases"
    ],
    benefits: [
      "Health insurance",
      "Remote work flexibility",
      "401(k) matching",
      "Unlimited PTO"
    ],
    isActive: true,
    application_date: new Date(),
  },
  {
    job_title: "Frontend Developer",
    job_type: "full-time",
    location: "hybrid",
    experience: "entry",
    salary: 70000,
    description: "Join our team as a Frontend Developer to build beautiful and responsive user interfaces.",
    requirements: [
      "Experience with React or Vue.js",
      "Proficiency in HTML, CSS, and JavaScript",
      "Understanding of responsive design principles",
      "Experience with version control systems like Git"
    ],
    isActive: true,
    application_date: new Date(),
  },
  {
    job_title: "Product Manager",
    job_type: "full-time",
    location: "onsite",
    experience: "senior",
    salary: 120000,
    description: "Lead product development initiatives and work with cross-functional teams.",
    requirements: [
      "5+ years of product management experience",
      "Experience with agile methodologies",
      "Strong analytical and problem-solving skills",
      "Excellent communication skills"
    ],
    benefits: [
      "Stock options",
      "Comprehensive health plan",
      "Flexible work hours",
      "Professional development budget"
    ],
    isActive: true,
    application_date: new Date(),
  },
  {
    job_title: "UX Designer",
    job_type: "contract",
    location: "remote",
    experience: "mid",
    salary: 80000,
    description: "Design user-centered digital experiences for our products.",
    requirements: [
      "Proficiency in Figma, Sketch, or Adobe XD",
      "Experience with user research and usability testing",
      "Strong portfolio demonstrating design process",
      "Understanding of front-end development constraints"
    ],
    isActive: true,
    application_date: new Date(),
  },
  {
    job_title: "DevOps Engineer",
    job_type: "full-time",
    location: "hybrid",
    experience: "senior",
    salary: 110000,
    description: "Build and maintain our cloud infrastructure and CI/CD pipelines.",
    requirements: [
      "Experience with AWS, Azure, or Google Cloud",
      "Knowledge of Docker and Kubernetes",
      "Experience with CI/CD tools like Jenkins or GitLab CI",
      "Infrastructure as Code experience (Terraform, CloudFormation)"
    ],
    benefits: [
      "Remote work options",
      "Training budget",
      "Latest hardware",
      "Health and wellness program"
    ],
    isActive: true,
    application_date: new Date(),
  }
];