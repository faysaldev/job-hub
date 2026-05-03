"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  Search,
  MapPin,
  Briefcase,
  Star,
  Filter,
  ChevronRight,
  User,
  ExternalLink,
  Code,
  Globe,
  Mail,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

const MOCK_CANDIDATES = [
  {
    id: "1",
    name: "Alex Rivera",
    role: "Senior Frontend Engineer",
    location: "San Francisco, CA",
    experience: "8 years",
    rating: 4.9,
    skills: ["React", "Next.js", "TypeScript", "TailwindCSS"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    bio: "Passionate about building highly interactive and accessible web applications.",
    availability: "Immediate",
  },
  {
    id: "2",
    name: "Sarah Chen",
    role: "Product Designer",
    location: "New York, NY",
    experience: "5 years",
    rating: 4.8,
    skills: ["Figma", "UI/UX", "Prototyping", "Adobe Suite"],
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    bio: "Focused on creating emotional connections through thoughtful digital design.",
    availability: "2 weeks notice",
  },
  {
    id: "3",
    name: "Marcus Johnson",
    role: "Full Stack Developer",
    location: "Austin, TX",
    experience: "6 years",
    rating: 4.7,
    skills: ["Node.js", "Python", "PostgreSQL", "AWS"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    bio: "Specializing in scalable backend architectures and robust API designs.",
    availability: "Immediate",
  },
  {
    id: "4",
    name: "Elena Rodriguez",
    role: "Data Scientist",
    location: "Chicago, IL",
    experience: "4 years",
    rating: 4.9,
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    bio: "Turning complex data into actionable business insights and predictive models.",
    availability: "1 month notice",
  },
  {
    id: "5",
    name: "David Kim",
    role: "Mobile Developer",
    location: "Seattle, WA",
    experience: "7 years",
    rating: 4.6,
    skills: ["React Native", "Flutter", "Swift", "Firebase"],
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    bio: "Crafting seamless mobile experiences across iOS and Android platforms.",
    availability: "Immediate",
  }
];

export default function CandidatesListingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCandidates = MOCK_CANDIDATES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <div className="bg-[#234C6A] pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            Discover Exceptional <span className="text-blue-400">Talent</span>
          </h1>
          <p className="text-xl text-blue-100/80 max-w-2xl mx-auto font-medium">
            Browse through our curated list of world-class professionals ready to take your team to the next level.
          </p>
          
          <div className="max-w-3xl mx-auto mt-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative flex flex-col md:flex-row gap-3 p-2 bg-white rounded-[28px] shadow-2xl">
                <div className="flex-1 flex items-center px-4 gap-3">
                  <Search className="h-6 w-6 text-gray-400" />
                  <Input 
                    placeholder="Search by name, role, or skills..." 
                    className="border-none bg-transparent h-14 text-lg focus-visible:ring-0 placeholder:text-gray-400 font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="hidden md:block w-px h-10 bg-gray-100 self-center"></div>
                <div className="flex items-center px-4 gap-3">
                  <MapPin className="h-6 w-6 text-gray-400" />
                  <select className="bg-transparent border-none text-gray-600 font-medium focus:ring-0 cursor-pointer">
                    <option>All Locations</option>
                    <option>Remote</option>
                    <option>On-site</option>
                  </select>
                </div>
                <Button className="h-14 px-10 rounded-2xl bg-[#234C6A] hover:bg-[#1a3a52] text-white font-bold text-lg shadow-lg transition-all active:scale-95">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 space-y-8">
            <div className="p-8 bg-white rounded-[32px] shadow-sm border border-gray-100 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#234C6A] flex items-center gap-2">
                  <Filter className="h-5 w-5" /> Filters
                </h3>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Clear all</button>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Experience Level</h4>
                <div className="space-y-3">
                  {['Entry Level', 'Mid Level', 'Senior Level', 'Expert'].map((level) => (
                    <label key={level} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 rounded-md border-2 border-gray-200 group-hover:border-blue-500 transition-colors"></div>
                      <span className="text-gray-600 font-medium group-hover:text-[#234C6A] transition-colors">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Availability</h4>
                <div className="space-y-3">
                  {['Immediate', '2 Weeks', '1 Month', 'Remote Only'].map((item) => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 rounded-md border-2 border-gray-200 group-hover:border-blue-500 transition-colors"></div>
                      <span className="text-gray-600 font-medium group-hover:text-[#234C6A] transition-colors">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50">
                <Button variant="outline" className="w-full rounded-2xl border-gray-100 text-[#234C6A] font-bold h-12 hover:bg-gray-50">
                  Apply Filters
                </Button>
              </div>
            </div>

            <Card className="p-8 bg-gradient-to-br from-[#234C6A] to-[#456882] border-none rounded-[32px] text-white shadow-xl relative overflow-hidden group">
               <div className="relative z-10">
                  <Star className="h-8 w-8 text-yellow-400 mb-4 fill-yellow-400" />
                  <h3 className="text-xl font-bold mb-2">Featured Talent</h3>
                  <p className="text-blue-100/70 text-sm mb-6 leading-relaxed">Promote your profile to reach thousands of top employers daily.</p>
                  <Button className="w-full bg-white text-[#234C6A] hover:bg-white/90 rounded-2xl font-bold h-12 shadow-lg transition-transform group-hover:scale-105 active:scale-95">
                    Upgrade Profile
                  </Button>
               </div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
            </Card>
          </aside>

          {/* Candidates List */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 font-medium">
                Showing <span className="text-[#234C6A] font-bold">{filteredCandidates.length}</span> exceptional candidates
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 font-medium">Sort by:</span>
                <select className="bg-transparent border-none text-[#234C6A] font-bold focus:ring-0 cursor-pointer text-sm">
                  <option>Top Rated</option>
                  <option>Most Experience</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredCandidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>

            {filteredCandidates.length === 0 && (
              <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="h-10 w-10 text-gray-200" />
                </div>
                <h3 className="text-2xl font-bold text-[#234C6A]">No candidates found</h3>
                <p className="text-gray-400 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CandidateCard({ candidate }: { candidate: any }) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-500 border-none bg-white shadow-md hover:shadow-2xl rounded-[32px] border border-transparent hover:border-blue-100/50">
      <div className="p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar & Basic Info */}
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[28px] overflow-hidden border-4 border-gray-50 shadow-inner">
              <img 
                src={candidate.image} 
                alt={candidate.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-green-500 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-[#234C6A] group-hover:text-blue-600 transition-colors">
                  {candidate.name}
                </h3>
                <p className="text-[#456882] font-bold text-lg">{candidate.role}</p>
              </div>
              <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-2xl border border-yellow-100 shadow-sm">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="font-black text-yellow-700 text-lg">{candidate.rating}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <MapPin className="h-4 w-4 text-blue-500" />
                {candidate.location}
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <Briefcase className="h-4 w-4 text-blue-500" />
                {candidate.experience} Exp
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <Clock className="h-4 w-4 text-blue-500" />
                {candidate.availability}
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed max-w-2xl line-clamp-2">
              {candidate.bio}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {candidate.skills.map((skill: string) => (
                <Badge key={skill} className="bg-blue-50 text-blue-600 border-none px-4 py-1.5 rounded-xl font-bold text-xs uppercase tracking-tight">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                   <img src={`https://i.pravatar.cc/100?u=${candidate.id}${i}`} alt="Company" />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              Vouched by 12+ Top Recruiters
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="rounded-2xl font-bold text-gray-400 hover:text-red-500 transition-colors px-4 h-14">
              <Heart className="h-6 w-6" />
            </Button>
            <Link href={`/candidates/${candidate.id}`}>
              <Button className="rounded-2xl bg-white border-2 border-gray-100 hover:border-blue-100 hover:bg-blue-50 text-[#234C6A] font-bold px-8 h-14 shadow-sm transition-all group-hover:shadow-lg">
                View Profile
              </Button>
            </Link>
            <Button className="rounded-2xl bg-[#234C6A] hover:bg-[#1a3a52] text-white font-bold px-10 h-14 shadow-xl transition-all active:scale-95">
              Hire Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Clock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function Heart(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
