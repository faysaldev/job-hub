"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  User,
  MessageSquare,
  Calendar,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Heart,
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
    href: "/job-seeker",
    icon: LayoutDashboard,
    label: "Overview",
  },
  {
    href: "/job-seeker/applications",
    icon: Briefcase,
    label: "My Applications",
  },
  {
    href: "/job-seeker/messages",
    icon: MessageSquare,
    label: "Messages",
  },
  {
    href: "/job-seeker/interviews",
    icon: Calendar,
    label: "Interviews",
  },

  {
    href: "/job-seeker/profile",
    icon: User,
    label: "My Profile",
  },
];

const JobSeekerSidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen border-r border-[#163B5C]/10 bg-white/95 transition-all duration-300 flex flex-col shadow-2xl shadow-[#163B5C]/10 z-40 backdrop-blur-xl",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* Logo Section */}
      <div className="border-b border-[#E1E8EF]/80 p-4">
        <Link href="/job-seeker" className="flex items-center gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#163B5C] to-[#516C83] shadow-lg shadow-[#163B5C]/20">
            <User className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-black tracking-tight text-[#163B5C]">
                JobHub
              </h2>
              <p className="text-xs font-semibold text-[#516C83]">
                Seeker Portal
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="custom-scrollbar flex-1 space-y-2 overflow-y-auto p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-[#163B5C] to-[#516C83] text-white shadow-lg shadow-[#163B5C]/20"
                  : "text-[#516C83] hover:bg-[#163B5C]/8 hover:text-[#163B5C]",
                isCollapsed && "justify-center px-3",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 flex-shrink-0 text-sm",
                  isActive
                    ? "text-white"
                    : "text-[#516C83] group-hover:text-[#163B5C]",
                )}
              />
              {!isCollapsed && (
                <>
                  <span className="flex-1 font-black text-sm">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-black",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#163B5C]/10 text-[#163B5C]",
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="invisible absolute left-full z-50 ml-2 whitespace-nowrap rounded-2xl bg-[#163B5C] px-3 py-2 text-sm font-bold text-white opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                  {item.label}
                  {item.badge && (
                    <span className="ml-2 rounded bg-white/20 px-1.5 py-0.5 text-xs">
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
      {!isCollapsed && (
        <div className="mx-4 mb-3 rounded-3xl border border-[#163B5C]/10 bg-[#F6F8FB] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Heart className="h-4 w-4 text-[#163B5C]" />
            <p className="text-xs font-black uppercase tracking-widest text-[#163B5C]">
              Career Focus
            </p>
          </div>
          <p className="text-xs leading-5 text-[#516C83]">
            Keep applying, updating, and tracking your next opportunity.
          </p>
        </div>
      )}

      <div className="border-t border-[#E1E8EF]/80 p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-black text-[#516C83] transition-colors hover:bg-[#163B5C]/10 hover:text-[#163B5C]"
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

export default JobSeekerSidebar;
