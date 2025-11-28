import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { MapPin, Briefcase, Clock, DollarSign } from "lucide-react";
import Link from "next/link";
import { Job } from "@/src/types";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <Link href={`/job/${job.id}`}>
      <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:border-[#234C6A]/50 border border-[#456882]/30 bg-white">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div>
              <h3 className="text-xl font-semibold mb-1 text-[#234C6A] hover:text-[#456882] transition-colors">
                {job.title}
              </h3>
              <p className="text-[#234C6A]">
                {job.company}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-[#234C6A]">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {job.type}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {job.salary}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {job.posted}
              </span>
            </div>

            <p className="text-[#234C6A] line-clamp-2">
              {job.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="bg-[#234C6A]/10 text-[#234C6A] hover:bg-[#234C6A]/20"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Button 
            variant="outline" 
            className="md:ml-4 border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10"
          >
            View Details
          </Button>
        </div>
      </Card>
    </Link>
  );
};

export default JobCard;