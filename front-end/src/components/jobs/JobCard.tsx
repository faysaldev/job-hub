import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building2,
  ArrowRight,
  Bookmark,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Job } from "@/src/types";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const postedText = job.posted || job.postedAt || "";
  const isNew = postedText.includes("day") && parseInt(postedText) <= 3;
  const isRemote = job.location.toLowerCase().includes("remote");

  return (
    <Link href={`/job/${job.id}`}>
      <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:border-[#163B5C]/30 border border-[#E1E8EF] bg-white rounded-xl group">
        <div className="flex flex-col lg:flex-row lg:items-start gap-5">
          {/* Company Logo Placeholder */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#163B5C]/10 to-[#516C83]/10 flex items-center justify-center flex-shrink-0 group-hover:from-[#163B5C]/20 group-hover:to-[#516C83]/20 transition-colors">
            <Building2 className="h-7 w-7 text-[#163B5C]" />
          </div>

          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-semibold text-[#163B5C] group-hover:text-[#516C83] transition-colors">
                    {job.title}
                  </h3>
                  {isNew && (
                    <Badge className="bg-green-100 text-green-700 border-none text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      New
                    </Badge>
                  )}
                </div>
                <p className="text-[#516C83] font-medium">{job.company}</p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-[#516C83] hover:text-[#163B5C] hover:bg-[#163B5C]/10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Add to saved jobs logic here
                }}
              >
                <Bookmark className="h-5 w-5" />
              </Button>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-[#516C83]">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {job.location}
                {isRemote && (
                  <Badge className="ml-1 bg-blue-100 text-blue-700 border-none text-xs py-0">
                    Remote
                  </Badge>
                )}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                {job.type}
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" />
                {job.salary}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {postedText}
              </span>
            </div>

            {/* Description */}
            <p className="text-[#516C83] line-clamp-2 text-sm leading-relaxed">
              {job.description}
            </p>

            {/* Skills & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
              <div className="flex flex-wrap gap-2">
                {job.skills.slice(0, 4).map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-[#163B5C]/10 text-[#163B5C] border-none hover:bg-[#163B5C]/20 transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
                {job.skills.length > 4 && (
                  <Badge className="bg-[#E1E8EF] text-[#516C83] border-none">
                    +{job.skills.length - 4}
                  </Badge>
                )}
              </div>

              <Button
                className="bg-gradient-to-r from-[#163B5C] to-[#516C83] hover:from-[#163B5C]/90 hover:to-[#516C83]/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                View Details
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default JobCard;
