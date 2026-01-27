"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Users,
  Building2,
  MessageSquare,
  Plus,
  Calendar,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useState } from "react";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    href: "/recruiter",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/recruiter/jobs",
    icon: Briefcase,
    label: "Job Listings",
    badge: 24,
  },
  {
    href: "/recruiter/create-job",
    icon: Plus,
    label: "Create Job",
  },
  {
    href: "/recruiter/applicants",
    icon: Users,
    label: "Applicants",
    badge: 28,
  },
  {
    href: "/recruiter/interviews",
    icon: Calendar,
    label: "Schedule Interview",
    badge: 5,
  },
  {
    href: "/recruiter/company",
    icon: Building2,
    label: "Company Profile",
  },
  {
    href: "/recruiter/messages",
    icon: MessageSquare,
    label: "Messages",
    badge: 3,
  },
];

const RecruiterSidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen bg-white border-r border-[#E3E3E3] transition-all duration-300 flex flex-col shadow-lg z-40",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-[#E3E3E3]">
        <Link href="/recruiter" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center flex-shrink-0">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-[#234C6A]">JobHub</h2>
              <p className="text-xs text-[#456882]">Recruiter Portal</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-gradient-to-r from-[#234C6A] to-[#456882] text-white shadow-lg"
                  : "text-[#456882] hover:bg-[#234C6A]/10 hover:text-[#234C6A]",
                isCollapsed && "justify-center px-3"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-white" : "text-[#456882] group-hover:text-[#234C6A]"
                )}
              />
              {!isCollapsed && (
                <>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "px-2 py-0.5 text-xs rounded-full font-semibold",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#234C6A]/10 text-[#234C6A]"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-[#234C6A] text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                  {item.label}
                  {item.badge && (
                    <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-[#E3E3E3]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[#456882] hover:bg-[#234C6A]/10 hover:text-[#234C6A] rounded-xl transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span className="font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default RecruiterSidebar;
