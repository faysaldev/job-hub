import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Search, MapPin } from "lucide-react";

interface SearchSectionProps {
  searchTerm: string;
  locationTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onSearchKeyDown: (e: React.KeyboardEvent) => void;
}

const SearchSection = ({
  searchTerm,
  locationTerm,
  onSearchChange,
  onLocationChange,
  onSearch,
  onSearchKeyDown
}: SearchSectionProps) => {
  return (
    <section className="bg-gradient-to-br from-[#234C6A]/5 via-[#456882]/5 to-[#E3E3E3]/30 border-b border-[#456882]/30 py-12">
      <div className="container">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#234C6A]">
          Find Your Dream Job
        </h1>
        <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#234C6A]" />
            <Input
              placeholder="Job title, keywords, or company"
              className="pl-10 h-12 bg-white border-[#234C6A]/30 focus:border-[#234C6A] focus:ring-[#234C6A] text-[#234C6A]"
              value={searchTerm}
              onChange={onSearchChange}
              onKeyDown={onSearchKeyDown}
            />
          </div>
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#234C6A]" />
            <Input
              placeholder="City, state, or remote"
              className="pl-10 h-12 bg-white border-[#234C6A]/30 focus:border-[#234C6A] focus:ring-[#234C6A] text-[#234C6A]"
              value={locationTerm}
              onChange={onLocationChange}
              onKeyDown={onSearchKeyDown}
            />
          </div>
          <Button 
            className="h-12 px-8 bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
            onClick={onSearch}
          >
            Search Jobs
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;