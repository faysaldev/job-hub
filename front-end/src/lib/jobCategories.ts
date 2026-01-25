// Job Categories with Subcategories
export interface SubCategory {
  id: string;
  name: string;
  count: number;
}

export interface JobCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
  subcategories: SubCategory[];
}

export const jobCategories: JobCategory[] = [
  {
    id: "technology",
    name: "Technology",
    icon: "Code",
    color: "from-blue-500 to-cyan-500",
    count: 2450,
    subcategories: [
      { id: "frontend", name: "Frontend Development", count: 520 },
      { id: "backend", name: "Backend Development", count: 480 },
      { id: "fullstack", name: "Full Stack Development", count: 390 },
      { id: "mobile", name: "Mobile Development", count: 310 },
      { id: "devops", name: "DevOps & Cloud", count: 280 },
      { id: "data-science", name: "Data Science & AI", count: 245 },
      { id: "cybersecurity", name: "Cybersecurity", count: 125 },
      { id: "qa", name: "QA & Testing", count: 100 },
    ],
  },
  {
    id: "design",
    name: "Design",
    icon: "Palette",
    color: "from-purple-500 to-pink-500",
    count: 890,
    subcategories: [
      { id: "ui-ux", name: "UI/UX Design", count: 320 },
      { id: "graphic", name: "Graphic Design", count: 210 },
      { id: "product", name: "Product Design", count: 180 },
      { id: "motion", name: "Motion Design", count: 95 },
      { id: "brand", name: "Brand Design", count: 85 },
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: "Megaphone",
    color: "from-orange-500 to-amber-500",
    count: 1120,
    subcategories: [
      { id: "digital", name: "Digital Marketing", count: 380 },
      { id: "seo", name: "SEO & SEM", count: 220 },
      { id: "content", name: "Content Marketing", count: 195 },
      { id: "social", name: "Social Media", count: 175 },
      { id: "email", name: "Email Marketing", count: 90 },
      { id: "analytics", name: "Marketing Analytics", count: 60 },
    ],
  },
  {
    id: "sales",
    name: "Sales",
    icon: "TrendingUp",
    color: "from-green-500 to-emerald-500",
    count: 980,
    subcategories: [
      { id: "account-exec", name: "Account Executive", count: 290 },
      { id: "sdr", name: "Sales Development", count: 240 },
      { id: "enterprise", name: "Enterprise Sales", count: 180 },
      { id: "sales-ops", name: "Sales Operations", count: 145 },
      { id: "customer-success", name: "Customer Success", count: 125 },
    ],
  },
  {
    id: "finance",
    name: "Finance",
    icon: "DollarSign",
    color: "from-emerald-500 to-teal-500",
    count: 650,
    subcategories: [
      { id: "accounting", name: "Accounting", count: 210 },
      { id: "financial-analyst", name: "Financial Analysis", count: 175 },
      { id: "investment", name: "Investment Banking", count: 120 },
      { id: "tax", name: "Tax & Audit", count: 85 },
      { id: "payroll", name: "Payroll", count: 60 },
    ],
  },
  {
    id: "hr",
    name: "Human Resources",
    icon: "Users",
    color: "from-rose-500 to-red-500",
    count: 420,
    subcategories: [
      { id: "recruiting", name: "Recruiting", count: 180 },
      { id: "hr-manager", name: "HR Management", count: 120 },
      { id: "training", name: "Training & Development", count: 65 },
      { id: "compensation", name: "Compensation & Benefits", count: 55 },
    ],
  },
  {
    id: "operations",
    name: "Operations",
    icon: "Settings",
    color: "from-slate-500 to-gray-600",
    count: 540,
    subcategories: [
      { id: "project-mgmt", name: "Project Management", count: 195 },
      { id: "supply-chain", name: "Supply Chain", count: 145 },
      { id: "logistics", name: "Logistics", count: 110 },
      { id: "facilities", name: "Facilities", count: 90 },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: "Heart",
    color: "from-red-500 to-rose-500",
    count: 780,
    subcategories: [
      { id: "nursing", name: "Nursing", count: 290 },
      { id: "medical", name: "Medical Practitioners", count: 210 },
      { id: "pharma", name: "Pharmaceutical", count: 150 },
      { id: "health-admin", name: "Healthcare Admin", count: 130 },
    ],
  },
];

// Company size options
export const companySizes = [
  { id: "1-10", label: "Startup (1-10)", min: 1, max: 10 },
  { id: "11-50", label: "Small (11-50)", min: 11, max: 50 },
  { id: "51-200", label: "Medium (51-200)", min: 51, max: 200 },
  { id: "201-500", label: "Large (201-500)", min: 201, max: 500 },
  { id: "501-1000", label: "Enterprise (501-1000)", min: 501, max: 1000 },
  { id: "1000+", label: "Corporation (1000+)", min: 1000, max: Infinity },
];

// Posted date options
export const postedDateOptions = [
  { id: "today", label: "Today", days: 0 },
  { id: "3days", label: "Last 3 days", days: 3 },
  { id: "week", label: "This week", days: 7 },
  { id: "2weeks", label: "Last 2 weeks", days: 14 },
  { id: "month", label: "This month", days: 30 },
  { id: "anytime", label: "Anytime", days: Infinity },
];

// Applicants count options
export const applicantsOptions = [
  { id: "0-10", label: "Less than 10", min: 0, max: 10 },
  { id: "10-50", label: "10-50 applicants", min: 10, max: 50 },
  { id: "50-100", label: "50-100 applicants", min: 50, max: 100 },
  { id: "100+", label: "100+ applicants", min: 100, max: Infinity },
];

// Salary ranges
export const salaryRanges = [
  { id: "0-30k", label: "$0 - $30k", min: 0, max: 30000 },
  { id: "30k-50k", label: "$30k - $50k", min: 30000, max: 50000 },
  { id: "50k-75k", label: "$50k - $75k", min: 50000, max: 75000 },
  { id: "75k-100k", label: "$75k - $100k", min: 75000, max: 100000 },
  { id: "100k-150k", label: "$100k - $150k", min: 100000, max: 150000 },
  { id: "150k+", label: "$150k+", min: 150000, max: Infinity },
];
