import { Card } from "@/src/components/ui/card";

interface JobDetailsSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const JobDetailsSection = ({ title, children, className = "" }: JobDetailsSectionProps) => {
  return (
    <Card className={`p-6 bg-white border-[#456882]/30 ${className}`}>
      <h2 className="text-2xl font-semibold mb-4 text-[#234C6A]">{title}</h2>
      {children}
    </Card>
  );
};

export default JobDetailsSection;