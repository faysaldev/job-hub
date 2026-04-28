import { IJob } from "./job.model";

export const dummyJobs: Partial<IJob>[] = [
  {
    title: "Software Engineer",
    type: "full-time",
    location: "remote",
    experienceLevel: "mid",
    salaryMin: 90000,
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
    applicationDeadline: new Date(),
  },
  {
    title: "Frontend Developer",
    type: "full-time",
    location: "hybrid",
    experienceLevel: "junior",
    salaryMin: 70000,
    description: "Join our team as a Frontend Developer to build beautiful and responsive user interfaces.",
    requirements: [
      "Experience with React or Vue.js",
      "Proficiency in HTML, CSS, and JavaScript",
      "Understanding of responsive design principles",
      "Experience with version control systems like Git"
    ],
    isActive: true,
    applicationDeadline: new Date(),
  },
  {
    title: "Product Manager",
    type: "full-time",
    location: "onsite",
    experienceLevel: "senior",
    salaryMin: 120000,
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
    applicationDeadline: new Date(),
  },
  {
    title: "UX Designer",
    type: "contract",
    location: "remote",
    experienceLevel: "mid",
    salaryMin: 80000,
    description: "Design user-centered digital experiences for our products.",
    requirements: [
      "Proficiency in Figma, Sketch, or Adobe XD",
      "Experience with user research and usability testing",
      "Strong portfolio demonstrating design process",
      "Understanding of front-end development constraints"
    ],
    isActive: true,
    applicationDeadline: new Date(),
  },
  {
    title: "DevOps Engineer",
    type: "full-time",
    location: "hybrid",
    experienceLevel: "senior",
    salaryMin: 110000,
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
    applicationDeadline: new Date(),
  }
];
