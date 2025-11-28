import { Button } from "@/src/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, totalJobs, onPageChange }: PaginationProps) => {
  // Calculate the range of pages to show
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show around current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, -1); // -1 represents the dots
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push(-1, totalPages); // -1 represents the dots
    } else {
      rangeWithDots.push(totalPages);
    }

    // Remove duplicates
    const uniquePages = [...new Set(rangeWithDots)];
    return uniquePages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between border-t border-[#456882]/30 px-4 py-3 sm:px-6 bg-white">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-[#234C6A] hover:bg-[#234C6A]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </Button>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-3 bg-[#234C6A] hover:bg-[#234C6A]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-[#234C6A]">
            Showing <span className="font-medium">{Math.min((currentPage - 1) * 5 + 1, totalJobs)}</span> to{" "}
            <span className="font-medium">
              {Math.min(currentPage * 5, totalJobs)}
            </span> of{" "}
            <span className="font-medium">{totalJobs}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-[#234C6A] ring-1 ring-inset ring-[#456882]/30 hover:bg-[#234C6A]/10 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </Button>

            {pageNumbers.map((page, index) => (
              <Button
                key={index}
                onClick={() => page > 0 && onPageChange(page)}
                className={`${
                  currentPage === page
                    ? "z-10 bg-[#234C6A] text-white"
                    : "text-[#234C6A] hover:bg-[#234C6A]/10"
                } relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  page === -1
                    ? "bg-white text-[#234C6A] cursor-default"
                    : "ring-1 ring-inset ring-[#456882]/30"
                } focus:z-20 focus:outline-offset-0 ${
                  page === -1 ? "px-2" : ""
                }`}
                disabled={page === -1}
              >
                {page === -1 ? <MoreHorizontal className="h-4 w-4" /> : page}
              </Button>
            ))}

            <Button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-[#234C6A] ring-1 ring-inset ring-[#456882]/30 hover:bg-[#234C6A]/10 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;