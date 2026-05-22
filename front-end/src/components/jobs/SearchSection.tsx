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
  onTrendingClick?: (term: string) => void;
}

const SearchSection = ({
  searchTerm,
  locationTerm,
  onSearchChange,
  onLocationChange,
  onSearch,
  onSearchKeyDown,
  onTrendingClick,
}: SearchSectionProps) => {
  const popularSearches = [
    "Remote",
    "Frontend",
    "Backend",
    "Full Stack",
    "Design",
  ];

  return (
    <section className="relative overflow-hidden bg-[#234C6A] py-20 md:py-24">
      {/* Background texture */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/15 to-transparent" />
        <div className="absolute left-8 top-20 hidden h-28 w-56 rotate-[-8deg] rounded-[2rem] border border-white/10 bg-white/5 lg:block" />
        <div className="absolute bottom-16 right-10 hidden h-32 w-64 rotate-[8deg] rounded-[2rem] border border-white/10 bg-white/5 lg:block" />
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <div className="mx-auto mb-8 max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-sm font-bold text-white/90">
              Curated roles from verified employers
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:text-6xl">
            Search jobs that fit the way you work.
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-white/75">
            Filter by title, location, category, job type, salary, and
            experience while keeping the full backend-powered job flow intact.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl border border-white/20 bg-white/95 p-3 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
                <Input
                  placeholder="Job title, keywords, or company"
                  className="h-14 rounded-2xl border border-transparent bg-[#F4F7F8] pl-12 text-base text-[#234C6A] placeholder:text-[#456882]/60 focus:border-[#234C6A]/15 focus:bg-white focus:ring-2 focus:ring-[#234C6A]/10"
                  value={searchTerm}
                  onChange={onSearchChange}
                  onKeyDown={onSearchKeyDown}
                />
              </div>

              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
                <Input
                  placeholder="City, state, or remote"
                  className="h-14 rounded-2xl border border-transparent bg-[#F4F7F8] pl-12 text-base text-[#234C6A] placeholder:text-[#456882]/60 focus:border-[#234C6A]/15 focus:bg-white focus:ring-2 focus:ring-[#234C6A]/10"
                  value={locationTerm}
                  onChange={onLocationChange}
                  onKeyDown={onSearchKeyDown}
                />
              </div>

              <Button
                className="h-14 rounded-2xl bg-[#234C6A] px-8 text-base font-black text-white shadow-lg shadow-[#234C6A]/20 transition-all hover:bg-[#1c405a]"
                onClick={onSearch}
              >
                <Search className="h-5 w-5 mr-2" />
                Search Jobs
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <span className="flex items-center gap-2 text-sm font-semibold text-white/70">
              <TrendingUp className="h-4 w-4" />
              Trending:
            </span>
            {popularSearches.map((term, index) => (
              <Badge
                key={index}
                className="cursor-pointer rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-white transition-colors hover:bg-white/20"
                onClick={() => {
                  if (onTrendingClick) {
                    onTrendingClick(term);
                  } else {
                    const event = {
                      target: { value: term },
                    } as React.ChangeEvent<HTMLInputElement>;
                    onSearchChange(event);
                  }
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
