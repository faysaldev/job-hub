"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";
import {
  Briefcase, X, LogOut, Bell, ChevronDown, ChevronRight, Building2,
  Search, Heart, Info, Phone, Sparkles, TrendingUp, Shield, Star,
  Clock, CheckCircle, ArrowRight, LayoutDashboard, PlusCircle, Eye,
  Users, Code, Palette, Megaphone, DollarSign, Settings, Grid3X3, Zap,
  type LucideIcon,
} from "lucide-react";
import { jobCategories } from "@/src/lib/jobCategories";

// ============================================================================
// TYPES
// ============================================================================
type UserRole = "jobseeker" | "recruiter";
type DropdownType = "categories" | "employers" | "notifications" | "user" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
  color?: string;
}

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: LucideIcon;
  isNew: boolean;
  color: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================
export const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "jobseeker",
  avatar: "https://github.com/shadcn.png",
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Code, Palette, Megaphone, TrendingUp, DollarSign, Users, Settings, Heart: Briefcase,
};

const NAV_ITEMS: NavItem[] = [
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone },
];

const JOB_SEEKER_MENU: NavItem[] = [
  { href: "/job-seeker", label: "Dashboard", icon: LayoutDashboard, description: "View your activity" },
  { href: "/job/saved", label: "Saved Jobs", icon: Heart, description: "Jobs you bookmarked" },
  { href: "/notifications", label: "Notifications", icon: Bell, description: "Stay updated" },
];

const RECRUITER_MENU: NavItem[] = [
  { href: "/recruiter", label: "Dashboard", icon: LayoutDashboard, description: "Manage your jobs" },
  { href: "/recruiter/create-job", label: "Post a Job", icon: PlusCircle, description: "Create new listing" },
  { href: "/notifications", label: "Notifications", icon: Bell, description: "Stay updated" },
];

const EMPLOYER_MENU: NavItem[] = [
  { href: "/auth", label: "Post a Job", icon: PlusCircle, description: "Reach millions of candidates", badge: "Popular", color: "from-[#234C6A] to-[#456882]" },
  { href: "/recruiter", label: "Recruiter Dashboard", icon: LayoutDashboard, description: "Manage applications", color: "from-blue-500 to-cyan-500" },
  { href: "/recruiter", label: "Search Candidates", icon: Search, description: "Find perfect matches", color: "from-green-500 to-emerald-500" },
  { href: "/recruiter", label: "Analytics", icon: TrendingUp, description: "Track metrics", color: "from-purple-500 to-pink-500" },
];

const NOTIFICATIONS: Notification[] = [
  { id: 1, title: "New job matching your skills", description: "Senior React Developer at TechCorp", time: "2 hours ago", icon: Briefcase, isNew: true, color: "from-blue-500 to-cyan-500" },
  { id: 2, title: "Application viewed", description: "Your profile was viewed by Google", time: "5 hours ago", icon: Eye, isNew: true, color: "from-green-500 to-emerald-500" },
  { id: 3, title: "Interview scheduled", description: "Tomorrow at 2:00 PM with Meta", time: "1 day ago", icon: Users, isNew: false, color: "from-purple-500 to-pink-500" },
];

const USER_STATS = [
  { label: "Applied", value: "12" },
  { label: "Saved", value: "8" },
  { label: "Views", value: "156" },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================
const IconBox = ({ icon: Icon, gradient, className }: { icon: LucideIcon; gradient?: string; className?: string }) => (
  <div className={cn("flex items-center justify-center rounded-xl", gradient ? `bg-gradient-to-br ${gradient}` : "bg-[#234C6A]/10", className)}>
    <Icon className="h-5 w-5 text-white" />
  </div>
);

const MenuLink = ({ href, icon: Icon, label, description, badge, color, isActive, onClick, className }: NavItem & { isActive?: boolean; onClick?: () => void; className?: string }) => (
  <Link href={href} onClick={onClick} className={cn("flex items-center gap-3 p-3 rounded-xl transition-all group", isActive ? "bg-gradient-to-r from-[#234C6A] to-[#456882] text-white shadow-lg" : "hover:bg-[#E3E3E3]/50", className)}>
    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105", color ? `bg-gradient-to-br ${color}` : isActive ? "bg-white/20" : "bg-[#234C6A]/10")}>
      <Icon className={cn("h-5 w-5", color || isActive ? "text-white" : "text-[#234C6A]")} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className={cn("font-semibold", isActive ? "text-white" : "text-[#234C6A]")}>{label}</span>
        {badge && <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-none text-xs">{badge}</Badge>}
      </div>
      {description && <p className={cn("text-xs truncate", isActive ? "text-white/70" : "text-[#456882]")}>{description}</p>}
    </div>
    <ChevronRight className={cn("h-4 w-4 opacity-0 group-hover:opacity-100 transition-all", isActive ? "text-white opacity-100" : "text-[#456882]")} />
  </Link>
);

const DropdownPanel = ({ isOpen, children, className }: { isOpen: boolean; children: React.ReactNode; className?: string }) => (
  <div className={cn("absolute top-full pt-3 transition-all duration-300", isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none", className)}>
    <div className="bg-white rounded-2xl shadow-2xl shadow-[#234C6A]/10 border border-[#234C6A]/10 overflow-hidden">
      {children}
    </div>
  </div>
);

const DropdownHeader = ({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle: string }) => (
  <div className="p-4 bg-gradient-to-r from-[#234C6A] to-[#456882]">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <h3 className="font-bold text-white">{title}</h3>
        <p className="text-sm text-white/80">{subtitle}</p>
      </div>
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const router = useRouter();
  const pathname = usePathname();

  const user = mockUser; // Replace with actual auth

  // Memoized values
  const userMenuItems = useMemo(() => user?.role === "recruiter" ? RECRUITER_MENU : JOB_SEEKER_MENU, [user?.role]);
  const selectedCategory = useMemo(() => jobCategories.find(c => c.id === hoveredCategory), [hoveredCategory]);
  const getCategoryIcon = useCallback((iconName: string) => CATEGORY_ICONS[iconName] || Briefcase, []);
  const isActive = useCallback((path: string) => pathname === path || pathname?.startsWith(`${path}/`), [pathname]);

  // Handlers
  const closeAll = useCallback(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setHoveredCategory(null);
    setMobileExpandedCategory(null);
  }, []);

  const toggleDropdown = useCallback((name: DropdownType) => {
    setActiveDropdown(prev => prev === name ? null : name);
    if (name !== "categories") setHoveredCategory(null);
  }, []);

  const navigateToCategory = useCallback((categoryId: string, subcategoryId?: string) => {
    const params = new URLSearchParams({ category: categoryId });
    if (subcategoryId) params.set("subcategory", subcategoryId);
    router.push(`/job?${params.toString()}`);
    closeAll();
  }, [router, closeAll]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/auth");
    closeAll();
  }, [router, closeAll]);

  // Effects
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setHoveredCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    queueMicrotask(closeAll);
  }, [pathname, closeAll]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <header className={cn("sticky top-0 z-50 w-full transition-all duration-300", scrolled ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-[#234C6A]/10" : "bg-[#E3E3E3]/95 backdrop-blur-lg border-b border-[#456882]/10")}>
      <div className="container flex h-16 items-center justify-between mx-auto px-4 lg:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl group z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-xl p-2 group-hover:scale-105 transition-transform">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
          </div>
          <span className="bg-gradient-to-r from-[#234C6A] to-[#456882] bg-clip-text text-transparent font-extrabold">JobHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav ref={dropdownRef} className="hidden lg:flex items-center gap-1">
          {/* Browse Jobs Dropdown */}
          <div className="relative">
            <button onClick={() => toggleDropdown("categories")} className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all", activeDropdown === "categories" || isActive("/job") ? "text-[#234C6A] bg-[#234C6A]/5" : "text-[#456882] hover:text-[#234C6A]")}>
              <Grid3X3 className="h-4 w-4" />
              Browse Jobs
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", activeDropdown === "categories" && "rotate-180")} />
            </button>

            <DropdownPanel isOpen={activeDropdown === "categories"} className="left-0">
              <div className="flex w-[600px]">
                {/* Categories List */}
                <div className="w-[280px] border-r border-[#E3E3E3]">
                  <DropdownHeader icon={Briefcase} title="Job Categories" subtitle="Find your perfect role" />
                  <Link href="/job" onClick={closeAll} className="flex items-center gap-3 p-3 mx-2 mt-2 rounded-xl bg-gradient-to-r from-[#234C6A]/5 to-[#456882]/5 hover:from-[#234C6A]/10 hover:to-[#456882]/10 group">
                    <IconBox icon={Zap} gradient="from-[#234C6A] to-[#456882]" className="w-10 h-10 shadow-md" />
                    <div className="flex-1">
                      <p className="font-semibold text-[#234C6A]">All Jobs</p>
                      <p className="text-xs text-[#456882]">Browse all positions</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#456882] group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <div className="p-2 max-h-[350px] overflow-y-auto">
                    {jobCategories.map((cat) => {
                      const Icon = getCategoryIcon(cat.icon);
                      return (
                        <button key={cat.id} onMouseEnter={() => setHoveredCategory(cat.id)} onClick={() => navigateToCategory(cat.id)} className={cn("flex items-center gap-3 w-full p-3 rounded-xl transition-all text-left group", hoveredCategory === cat.id ? "bg-[#234C6A]/10" : "hover:bg-[#E3E3E3]/50")}>
                          <IconBox icon={Icon} gradient={cat.color} className="w-10 h-10 shadow-md group-hover:scale-105 transition-transform" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#234C6A] truncate">{cat.name}</p>
                            <p className="text-xs text-[#456882]">{cat.count.toLocaleString()} jobs</p>
                          </div>
                          <ChevronRight className={cn("h-4 w-4 text-[#456882] transition-all", hoveredCategory === cat.id && "translate-x-1 text-[#234C6A]")} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subcategories Panel */}
                <div className="w-[320px] bg-[#FAFAFA]">
                  {selectedCategory ? (
                    <>
                      <div className="p-4 border-b border-[#E3E3E3]">
                        <h4 className="font-bold text-[#234C6A]">{selectedCategory.name}</h4>
                        <p className="text-sm text-[#456882]">{selectedCategory.subcategories.length} specializations</p>
                      </div>
                      <div className="p-2 max-h-[380px] overflow-y-auto">
                        {selectedCategory.subcategories.map((sub) => (
                          <button key={sub.id} onClick={() => navigateToCategory(selectedCategory.id, sub.id)} className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-white hover:shadow-md transition-all text-left group">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#234C6A] to-[#456882]" />
                              <span className="text-sm font-medium text-[#234C6A]">{sub.name}</span>
                            </div>
                            <Badge className="bg-[#234C6A]/10 text-[#234C6A] border-none text-xs">{sub.count}</Badge>
                          </button>
                        ))}
                      </div>
                      <div className="p-3 border-t border-[#E3E3E3]">
                        <button onClick={() => navigateToCategory(selectedCategory.id)} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#234C6A] to-[#456882] text-white font-medium hover:shadow-lg transition-all">
                          View all {selectedCategory.name} jobs
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-[#234C6A]/10 flex items-center justify-center mb-4">
                        <Search className="h-8 w-8 text-[#234C6A]" />
                      </div>
                      <h4 className="font-bold text-[#234C6A] mb-2">Explore Categories</h4>
                      <p className="text-sm text-[#456882]">Hover over a category to see specializations</p>
                    </div>
                  )}
                </div>
              </div>
            </DropdownPanel>
          </div>

          {/* Nav Items */}
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className={cn("relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all", isActive(item.href) ? "text-[#234C6A]" : "text-[#456882] hover:text-[#234C6A]")}>
              <item.icon className="h-4 w-4" />
              {item.label}
              {isActive(item.href) && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-[#234C6A] to-[#456882] rounded-full" />}
            </Link>
          ))}

          {/* For Employers Dropdown */}
          <div className="relative">
            <button onClick={() => toggleDropdown("employers")} className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all", activeDropdown === "employers" ? "text-[#234C6A] bg-[#234C6A]/5" : "text-[#456882] hover:text-[#234C6A]")}>
              <Building2 className="h-4 w-4" />
              For Employers
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", activeDropdown === "employers" && "rotate-180")} />
            </button>

            <DropdownPanel isOpen={activeDropdown === "employers"} className="right-0 w-[380px]">
              <DropdownHeader icon={Sparkles} title="Hire Top Talent" subtitle="Access millions of job seekers" />
              <div className="p-2">
                {EMPLOYER_MENU.map((item, i) => (
                  <MenuLink key={i} {...item} onClick={closeAll} />
                ))}
              </div>
              <div className="p-4 bg-[#E3E3E3]/30 border-t border-[#E3E3E3] flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[#456882]">
                  <Shield className="h-4 w-4" />
                  <span>Trusted by 10,000+ companies</span>
                </div>
                <Link href="/auth" onClick={closeAll} className="text-sm font-semibold text-[#234C6A] hover:text-[#456882] flex items-center gap-1">
                  Get Started <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </DropdownPanel>
          </div>
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <>
              <Link href="/job/saved">
                <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-xl", isActive("/job/saved") ? "text-[#234C6A] bg-[#234C6A]/10" : "text-[#456882] hover:text-[#234C6A] hover:bg-[#234C6A]/5")}>
                  <Heart className={cn("h-5 w-5", isActive("/job/saved") && "fill-[#234C6A]")} />
                </Button>
              </Link>

              {/* Notifications */}
              <div className="relative">
                <Button variant="ghost" size="icon" onClick={() => toggleDropdown("notifications")} className={cn("relative h-10 w-10 rounded-xl", activeDropdown === "notifications" ? "text-[#234C6A] bg-[#234C6A]/10" : "text-[#456882] hover:text-[#234C6A] hover:bg-[#234C6A]/5")}>
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white items-center justify-center">3</span>
                  </span>
                </Button>

                <DropdownPanel isOpen={activeDropdown === "notifications"} className="right-0 w-[380px]">
                  <div className="p-4 border-b border-[#E3E3E3] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconBox icon={Bell} gradient="from-[#234C6A] to-[#456882]" className="w-10 h-10" />
                      <div>
                        <h3 className="font-bold text-[#234C6A]">Notifications</h3>
                        <p className="text-xs text-[#456882]">You have 3 new updates</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-[#456882]">Mark all read</Button>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    {NOTIFICATIONS.map((n) => (
                      <Link key={n.id} href="/notifications" onClick={closeAll} className={cn("flex items-start gap-4 p-4 hover:bg-[#E3E3E3]/30 border-b border-[#E3E3E3]/50 last:border-0", n.isNew && "bg-gradient-to-r from-[#234C6A]/5 to-transparent")}>
                        <IconBox icon={n.icon} gradient={n.color} className="w-11 h-11 shadow-md flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn("text-sm font-medium truncate", n.isNew ? "text-[#234C6A]" : "text-[#456882]")}>{n.title}</p>
                            {n.isNew && <span className="w-2 h-2 rounded-full bg-[#234C6A] flex-shrink-0 mt-1.5" />}
                          </div>
                          <p className="text-xs text-[#456882] truncate mt-0.5">{n.description}</p>
                          <p className="text-xs text-[#456882]/70 mt-1 flex items-center gap-1"><Clock className="h-3 w-3" />{n.time}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href="/notifications" onClick={closeAll} className="flex items-center justify-center gap-2 p-3 bg-[#E3E3E3]/30 border-t border-[#E3E3E3] text-sm font-semibold text-[#234C6A] hover:text-[#456882]">
                    View all notifications <ArrowRight className="h-4 w-4" />
                  </Link>
                </DropdownPanel>
              </div>

              {/* User Menu */}
              <div className="relative ml-1">
                <button onClick={() => toggleDropdown("user")} className={cn("flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-all", activeDropdown === "user" ? "bg-[#234C6A]/10" : "hover:bg-[#234C6A]/5")}>
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white font-bold text-sm shadow-md">{user.name.charAt(0)}</div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-sm font-semibold text-[#234C6A] leading-tight">{user.name}</p>
                    <p className="text-xs text-[#456882] capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 text-[#456882] transition-transform", activeDropdown === "user" && "rotate-180")} />
                </button>

                <DropdownPanel isOpen={activeDropdown === "user"} className="right-0 w-[280px]">
                  <div className="p-4 bg-gradient-to-br from-[#234C6A] to-[#456882]">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-xl border-2 border-white/30">{user.name.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate">{user.name}</p>
                        <p className="text-sm text-white/70 truncate">{user.email}</p>
                        <Badge className="mt-1.5 bg-white/20 text-white border-white/30 text-xs capitalize"><Star className="h-3 w-3 mr-1" />{user.role}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-px bg-[#E3E3E3]/50 border-b border-[#E3E3E3]">
                    {USER_STATS.map((s, i) => (
                      <div key={i} className="bg-white p-3 text-center">
                        <p className="text-lg font-bold text-[#234C6A]">{s.value}</p>
                        <p className="text-xs text-[#456882]">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2">
                    {userMenuItems.map((item, i) => (
                      <MenuLink key={i} {...item} isActive={isActive(item.href)} onClick={closeAll} />
                    ))}
                  </div>
                  <div className="p-2 border-t border-[#E3E3E3]">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 rounded-xl text-red-500 hover:bg-red-50 transition-all">
                      <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center"><LogOut className="h-4 w-4" /></div>
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  </div>
                </DropdownPanel>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild className="text-[#234C6A] hover:text-[#456882] font-medium"><Link href="/auth">Sign In</Link></Button>
              <Button asChild className="bg-gradient-to-r from-[#234C6A] to-[#456882] text-white shadow-lg hover:shadow-xl rounded-xl px-6">
                <Link href="/auth">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden relative z-10 text-[#234C6A] p-2.5 rounded-xl hover:bg-[#234C6A]/10 transition-all" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <div className="w-6 h-5 flex flex-col justify-center items-center">
            <span className={cn("block h-0.5 w-6 bg-[#234C6A] rounded-full transition-all", mobileMenuOpen ? "rotate-45 translate-y-0.5" : "-translate-y-1.5")} />
            <span className={cn("block h-0.5 w-6 bg-[#234C6A] rounded-full transition-all", mobileMenuOpen ? "opacity-0" : "opacity-100")} />
            <span className={cn("block h-0.5 w-6 bg-[#234C6A] rounded-full transition-all", mobileMenuOpen ? "-rotate-45 -translate-y-0.5" : "translate-y-1.5")} />
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={cn("lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all", mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none")} onClick={closeAll} />

      {/* Mobile Menu Panel */}
      <div className={cn("lg:hidden fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300", mobileMenuOpen ? "translate-x-0" : "translate-x-full")}>
        {/* Mobile Header */}
        <div className="flex-shrink-0 p-4 border-b border-[#E3E3E3] flex items-center justify-between bg-gradient-to-r from-[#234C6A] to-[#456882]">
          <Link href="/" className="flex items-center gap-2.5" onClick={closeAll}>
            <div className="bg-white/20 rounded-xl p-2"><Briefcase className="h-5 w-5 text-white" /></div>
            <span className="font-bold text-white text-lg">JobHub</span>
          </Link>
          <button className="text-white p-2 rounded-xl hover:bg-white/20 active:scale-95" onClick={closeAll}><X className="h-6 w-6" /></button>
        </div>

        {/* User Section */}
        {user ? (
          <div className="flex-shrink-0 p-4 border-b border-[#E3E3E3] bg-gradient-to-br from-[#E3E3E3]/50 to-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white font-bold text-xl shadow-lg">{user.name.charAt(0)}</div>
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#234C6A] truncate">{user.name}</p>
                <p className="text-sm text-[#456882] truncate">{user.email}</p>
                <Badge className="mt-1 bg-[#234C6A]/10 text-[#234C6A] border-none text-xs capitalize"><Star className="h-3 w-3 mr-1" />{user.role}</Badge>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              {[{ href: "/job/saved", icon: Heart, label: "Saved" }, { href: "/notifications", icon: Bell, label: "Alerts", badge: "3" }, { href: "/job", icon: Search, label: "Search" }].map((item) => (
                <Link key={item.href} href={item.href} onClick={closeAll} className="flex-1 flex flex-col items-center gap-1 p-3 rounded-xl bg-white shadow-sm hover:shadow-md active:scale-95 relative">
                  <item.icon className="h-5 w-5 text-[#234C6A]" />
                  <span className="text-xs font-medium text-[#456882]">{item.label}</span>
                  {item.badge && <span className="absolute top-2 right-1/4 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{item.badge}</span>}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-shrink-0 p-4 border-b border-[#E3E3E3] bg-[#E3E3E3]/30">
            <Link href="/job" onClick={closeAll} className="flex items-center gap-3 w-full p-3 rounded-xl bg-white border border-[#E3E3E3] text-[#456882] hover:border-[#234C6A] hover:text-[#234C6A]">
              <Search className="h-5 w-5" /><span className="text-sm">Search for jobs...</span>
            </Link>
          </div>
        )}

        {/* Mobile Nav Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-5">
          {/* Main Nav */}
          <div className="space-y-2">
            <Link href="/job" onClick={closeAll} className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-gradient-to-r from-[#234C6A] to-[#456882] text-white font-semibold shadow-lg active:scale-[0.98]">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Grid3X3 className="h-5 w-5" /></div>
              <div className="flex-1"><p className="font-bold">Browse Jobs</p><p className="text-xs text-white/80">Find your dream job</p></div>
              <ArrowRight className="h-5 w-5" />
            </Link>
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} onClick={closeAll} className={cn("flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium active:scale-[0.98]", isActive(item.href) ? "bg-gradient-to-r from-[#234C6A] to-[#456882] text-white shadow-lg" : "bg-[#E3E3E3]/50 text-[#234C6A] hover:bg-[#234C6A]/10")}>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isActive(item.href) ? "bg-white/20" : "bg-[#234C6A]/10")}>
                  <item.icon className={cn("h-5 w-5", isActive(item.href) ? "text-white" : "text-[#234C6A]")} />
                </div>
                <span className="flex-1">{item.label}</span>
                {isActive(item.href) && <CheckCircle className="h-5 w-5" />}
              </Link>
            ))}
            <Link href="/recruiter" onClick={closeAll} className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-[#234C6A] font-medium active:scale-[0.98] hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md"><Building2 className="h-5 w-5 text-white" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="font-semibold">For Employers</span><Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-none text-[10px] px-1.5">Hire</Badge></div>
                <p className="text-xs text-[#456882]">Post jobs & find talent</p>
              </div>
              <ChevronRight className="h-5 w-5 text-[#456882]" />
            </Link>
          </div>

          <div className="border-t border-[#E3E3E3]" />

          {/* Categories */}
          <div>
            <p className="text-xs font-bold text-[#456882] uppercase tracking-wider px-1 mb-3 flex items-center gap-2"><Briefcase className="h-3.5 w-3.5" />Job Categories</p>
            <div className="space-y-1">
              {jobCategories.map((cat) => {
                const Icon = getCategoryIcon(cat.icon);
                const isExpanded = mobileExpandedCategory === cat.id;
                return (
                  <div key={cat.id} className="rounded-xl overflow-hidden">
                    <button onClick={() => setMobileExpandedCategory(isExpanded ? null : cat.id)} className={cn("flex items-center gap-3 w-full px-3 py-3 text-sm font-medium active:scale-[0.98]", isExpanded ? "bg-[#234C6A]/10 text-[#234C6A]" : "text-[#234C6A] hover:bg-[#E3E3E3]/50")}>
                      <IconBox icon={Icon} gradient={cat.color} className="w-10 h-10 shadow-md" />
                      <div className="flex-1 text-left"><p className="font-semibold">{cat.name}</p><p className="text-xs text-[#456882]">{cat.count.toLocaleString()} jobs</p></div>
                      <ChevronDown className={cn("h-5 w-5 text-[#456882] transition-transform", isExpanded && "rotate-180")} />
                    </button>
                    <div className={cn("overflow-hidden transition-all", isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0")}>
                      <div className="ml-5 pl-4 border-l-2 border-[#234C6A]/20 py-2 space-y-1">
                        <button onClick={() => { navigateToCategory(cat.id); closeAll(); }} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-[#234C6A] bg-[#234C6A]/5 hover:bg-[#234C6A]/10 active:scale-[0.98]">
                          <Zap className="h-4 w-4" />View all {cat.name}<ArrowRight className="h-4 w-4 ml-auto" />
                        </button>
                        {cat.subcategories.map((sub) => (
                          <button key={sub.id} onClick={() => { navigateToCategory(cat.id, sub.id); closeAll(); }} className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm text-[#456882] hover:text-[#234C6A] hover:bg-[#234C6A]/5 active:scale-[0.98]">
                            <span>{sub.name}</span>
                            <Badge className="bg-[#234C6A]/10 text-[#234C6A] border-none text-xs font-semibold">{sub.count}</Badge>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Account */}
          {user && (
            <div>
              <p className="text-xs font-bold text-[#456882] uppercase tracking-wider px-1 mb-3 flex items-center gap-2"><Users className="h-3.5 w-3.5" />Your Account</p>
              <div className="space-y-1">
                {userMenuItems.map((item, i) => (
                  <MenuLink key={i} {...item} isActive={isActive(item.href)} onClick={closeAll} />
                ))}
              </div>
            </div>
          )}
          <div className="h-24" />
        </div>

        {/* Mobile Footer */}
        <div className="flex-shrink-0 p-4 border-t border-[#E3E3E3] bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
          {user ? (
            <button onClick={handleLogout} className="flex items-center justify-center gap-3 w-full py-4 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 font-semibold active:scale-[0.98]">
              <LogOut className="h-5 w-5" />Sign Out
            </button>
          ) : (
            <div className="space-y-3">
              <Button asChild className="w-full bg-gradient-to-r from-[#234C6A] to-[#456882] text-white rounded-xl py-6 font-semibold shadow-lg active:scale-[0.98]">
                <Link href="/auth" onClick={closeAll}>Get Started Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button variant="outline" asChild className="w-full border-2 border-[#234C6A] text-[#234C6A] rounded-xl py-6 font-semibold hover:bg-[#234C6A]/5 active:scale-[0.98]">
                <Link href="/auth" onClick={closeAll}>Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
