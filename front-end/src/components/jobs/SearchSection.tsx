import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Search, MapPin, Sparkles, TrendingUp } from "lucide-react";

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
  onSearchKeyDown,
}: SearchSectionProps) => {
  const popularSearches = ["Remote", "Frontend", "Backend", "Full Stack", "Design"];

  return (
    <section className="relative bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] py-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span className="text-white/90 text-sm font-medium">
              Over 10,000+ jobs available
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Discover opportunities that match your skills, experience, and career goals
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-3 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Job Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
                <Input
                  placeholder="Job title, keywords, or company"
                  className="pl-12 h-14 bg-[#E3E3E3]/30 border-none focus:ring-2 focus:ring-[#234C6A]/20 text-[#234C6A] placeholder:text-[#456882]/60 rounded-xl text-base"
                  value={searchTerm}
                  onChange={onSearchChange}
                  onKeyDown={onSearchKeyDown}
                />
              </div>

              {/* Location Input */}
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
                <Input
                  placeholder="City, state, or remote"
                  className="pl-12 h-14 bg-[#E3E3E3]/30 border-none focus:ring-2 focus:ring-[#234C6A]/20 text-[#234C6A] placeholder:text-[#456882]/60 rounded-xl text-base"
                  value={locationTerm}
                  onChange={onLocationChange}
                  onKeyDown={onSearchKeyDown}
                />
              </div>

              {/* Search Button */}
              <Button
                className="h-14 px-8 bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all"
                onClick={onSearch}
              >
                <Search className="h-5 w-5 mr-2" />
                Search Jobs
              </Button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <span className="flex items-center gap-2 text-white/70 text-sm">
              <TrendingUp className="h-4 w-4" />
              Trending:
            </span>
            {popularSearches.map((term, index) => (
              <Badge
                key={index}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 cursor-pointer transition-colors px-4 py-1.5"
                onClick={() => {
                  const event = {
                    target: { value: term },
                  } as React.ChangeEvent<HTMLInputElement>;
                  onSearchChange(event);
                }}
              >
                {term}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
