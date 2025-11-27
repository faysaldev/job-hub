import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { DollarSign, Users, Building2, Star } from "lucide-react";
import { Job } from "@/src/types";

interface JobDetailsSidebarProps {
  job: Job;
}

const JobDetailsSidebar = ({ job }: JobDetailsSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Apply Card */}
      <Card className="p-6 bg-white border-[#456882]/30 sticky top-20">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-2xl font-bold text-[#234C6A]">
            <DollarSign className="h-6 w-6" />
            {job.salary}
          </div>
          <Button
            className="w-full bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
            size="lg"
          >
            Apply Now
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10"
          >
            Save Job
          </Button>
        </div>
      </Card>

      {/* Company Info */}
      <Card className="p-6 bg-white border-[#456882]/30">
        <h3 className="font-semibold mb-4 text-[#234C6A]">About {job.company}</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-[#234C6A]">
            <Users className="h-4 w-4" />
            <span>500-1000 employees</span>
          </div>
          <div className="flex items-center gap-2 text-[#234C6A]">
            <Building2 className="h-4 w-4" />
            <span>Technology & Software</span>
          </div>
          <div className="flex items-center gap-2 text-[#234C6A]">
            <Star className="h-4 w-4 fill-current text-[#456882]" />
            <span>4.5/5 company rating</span>
          </div>
        </div>
        <Button 
          variant="link" 
          className="mt-4 px-0 text-[#234C6A] hover:text-[#456882]"
        >
          View company profile
        </Button>
      </Card>
    </div>
  );
};

export default JobDetailsSidebar;