import { Badge } from "@/src/components/ui/badge";
import { Building2, MapPin, Briefcase, Clock } from "lucide-react";
import { Job } from "@/src/types";

interface JobDetailsHeaderProps {
  job: Job;
}

const JobDetailsHeader = ({ job }: JobDetailsHeaderProps) => {
  return (
    <div className="bg-gradient-to-br from-[#234C6A]/5 to-[#456882]/5 rounded-xl p-6 border border-[#456882]/30">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#234C6A]">
        {job.title}
      </h1>
      <div className="flex flex-wrap gap-4 text-[#234C6A] mb-6">
        <span className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {job.company}
        </span>
        <span className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {job.location}
        </span>
        <span className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          {job.type}
        </span>
        <span className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {job.posted}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {job.skills.map((skill, index) => (
          <Badge 
            key={index} 
            variant="secondary"
            className="text-sm bg-[#234C6A]/10 text-[#234C6A] hover:bg-[#234C6A]/20"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default JobDetailsHeader;