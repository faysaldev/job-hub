interface JobDetailsListProps {
  items: string[];
  className?: string;
}

const JobDetailsList = ({ items, className = "" }: JobDetailsListProps) => {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span className="text-[#516C83] font-bold">•</span>
          <span className="text-[#163B5C]">{item}</span>
        </li>
      ))}
    </ul>
  );
};

export default JobDetailsList;