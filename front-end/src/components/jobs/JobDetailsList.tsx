interface JobDetailsListProps {
  items: string[];
  className?: string;
}

const JobDetailsList = ({ items, className = "" }: JobDetailsListProps) => {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span className="text-[#456882] font-bold">•</span>
          <span className="text-[#234C6A]">{item}</span>
        </li>
      ))}
    </ul>
  );
};

export default JobDetailsList;