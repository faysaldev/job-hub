import { Button } from "@/src/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, totalJobs, onPageChange }: PaginationProps) => {
  // Calculate the range of pages to show
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, -1);
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push(-1, totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    const uniquePages = [...new Set(rangeWithDots)];
    return uniquePages.filter(p => p <= totalPages);
  };

  const pageNumbers = getPageNumbers();
  const startItem = Math.min((currentPage - 1) * 5 + 1, totalJobs);
  const endItem = Math.min(currentPage * 5, totalJobs);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white rounded-xl shadow-sm border border-[#234C6A]/10">
      {/* Mobile pagination */}
      <div className="flex sm:hidden w-full justify-between items-center">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          className="border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/10 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <span className="text-sm text-[#456882]">
          {currentPage} / {totalPages}
        </span>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          className="border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/10 disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Desktop pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between w-full">
        <div className="flex items-center gap-2">
          <p className="text-sm text-[#456882]">
            Showing{" "}
            <span className="font-semibold text-[#234C6A]">{startItem}</span>
            {" - "}
            <span className="font-semibold text-[#234C6A]">{endItem}</span>
            {" of "}
            <span className="font-semibold text-[#234C6A]">{totalJobs}</span>
            {" results"}
          </p>
        </div>

        <nav className="flex items-center gap-1" aria-label="Pagination">
          {/* First page */}
          <Button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 text-[#456882] hover:text-[#234C6A] hover:bg-[#234C6A]/10 disabled:opacity-50"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Previous page */}
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 text-[#456882] hover:text-[#234C6A] hover:bg-[#234C6A]/10 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, index) => (
              <Button
                key={index}
                onClick={() => page > 0 && onPageChange(page)}
                disabled={page === -1}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                className={`h-9 min-w-[36px] px-3 font-medium transition-all duration-200 ${
                  currentPage === page
                    ? "bg-gradient-to-r from-[#234C6A] to-[#456882] text-white shadow-md hover:from-[#234C6A]/90 hover:to-[#456882]/90"
                    : page === -1
                    ? "cursor-default hover:bg-transparent"
                    : "text-[#456882] hover:text-[#234C6A] hover:bg-[#234C6A]/10"
                }`}
              >
                {page === -1 ? <MoreHorizontal className="h-4 w-4" /> : page}
              </Button>
            ))}
          </div>

          {/* Next page */}
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 text-[#456882] hover:text-[#234C6A] hover:bg-[#234C6A]/10 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last page */}
          <Button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 text-[#456882] hover:text-[#234C6A] hover:bg-[#234C6A]/10 disabled:opacity-50"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;