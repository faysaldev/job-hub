"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { useAuth } from "@/src/hooks/useAuth";
import JobSeekerSidebar from "./JobSeekerSidebar";
import gsap from "gsap";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface JobSeekerLayoutProps {
  children: React.ReactNode;
}

const JobSeekerLayout = ({ children }: JobSeekerLayoutProps) => {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".page-content",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (!user) return null;

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col jobhub-page-bg"
    >
      <Header />

      <div className="relative flex flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#234C6A]/8 to-transparent" />

        {/* Desktop Sidebar */}
        <div className="relative z-20 hidden lg:block">
          <JobSeekerSidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        <div
          className={cn(
            "lg:hidden fixed inset-0 bg-[#234C6A]/50 backdrop-blur-sm z-40 transition-opacity duration-300",
            isMobileSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
          )}
          onClick={() => setIsMobileSidebarOpen(false)}
        />

        {/* Mobile Sidebar */}
        <div
          className={cn(
            "lg:hidden fixed left-0 top-0 h-full z-50 transition-transform duration-300",
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <JobSeekerSidebar />
        </div>

        {/* Main Content */}
        <main className="relative z-10 flex-1 min-h-screen overflow-y-auto custom-scrollbar">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden sticky top-0 z-30 border-b border-[#234C6A]/10 bg-white/90 p-4 shadow-sm backdrop-blur-xl">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="flex items-center gap-3 rounded-2xl border border-[#234C6A]/10 bg-[#234C6A]/5 px-4 py-3 font-black text-[#234C6A] transition-colors hover:bg-[#234C6A]/10"
            >
              {isMobileSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span>Seeker Menu</span>
              <LayoutDashboard className="ml-auto h-4 w-4 text-[#456882]" />
            </button>
          </div>

          {/* Page Content */}
          <div className="page-content p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default JobSeekerLayout;
