"use client";

import { useEffect, useRef, useState } from "react";
import Header, { mockUser } from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import RecruiterSidebar from "./RecruiterSidebar";
import gsap from "gsap";
import { Menu, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface RecruiterLayoutProps {
  children: React.ReactNode;
}

const RecruiterLayout = ({ children }: RecruiterLayoutProps) => {
  const user = mockUser;
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
    <div ref={containerRef} className="min-h-screen flex flex-col bg-[#E3E3E3]">
      <Header />

      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <RecruiterSidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        <div
          className={cn(
            "lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
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
          <RecruiterSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-[#E3E3E3] p-4">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-[#234C6A]/10 text-[#234C6A] rounded-lg hover:bg-[#234C6A]/20 transition-colors"
            >
              {isMobileSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="font-medium">Menu</span>
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

export default RecruiterLayout;
