"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Briefcase,
  Menu,
  X,
  LogOut,
  User,
  Bell,
  ChevronDown,
  ChevronRight,
  Building2,
  Search,
  Heart,
  Settings,
  HelpCircle,
  FileText,
  Users,
  Home,
  Info,
  Phone,
  Sparkles,
  Target,
  TrendingUp,
  Shield,
  Zap,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  UserCircle,
  LayoutDashboard,
  PlusCircle,
  Eye,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Mock user data - replace with actual auth context
export const mockUser: {
  id: string;
  name: string;
  email: string;
  role: "jobseeker" | "recruiter";
  avatar: string;
} = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "jobseeker",
  avatar: "https://github.com/shadcn.png",
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const user = mockUser; // Replace with actual auth state
  // const user = null; // Replace with actual auth state

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/auth");
  };

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  // Navigation items
  const navItems = [
    { href: "/job", label: "Find Jobs", icon: Search },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Phone },
  ];

  // User menu items for job seekers
  const jobSeekerMenuItems = [
    { href: "/job-seeker", label: "Dashboard", icon: LayoutDashboard, description: "View your activity" },
    { href: "/job/saved", label: "Saved Jobs", icon: Heart, description: "Jobs you bookmarked" },
    { href: "/notifications", label: "Notifications", icon: Bell, description: "Stay updated" },
  ];

  // User menu items for recruiters
  const recruiterMenuItems = [
    { href: "/recruiter", label: "Dashboard", icon: LayoutDashboard, description: "Manage your jobs" },
    { href: "/recruiter", label: "Post a Job", icon: PlusCircle, description: "Create new listing" },
    { href: "/notifications", label: "Notifications", icon: Bell, description: "Stay updated" },
  ];

  const userMenuItems = user?.role === "recruiter" ? recruiterMenuItems : jobSeekerMenuItems;

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: "New job matching your skills",
      description: "Senior React Developer at TechCorp",
      time: "2 hours ago",
      icon: Briefcase,
      isNew: true,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "Application viewed",
      description: "Your profile was viewed by Google",
      time: "5 hours ago",
      icon: Eye,
      isNew: true,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 3,
      title: "Interview scheduled",
      description: "Tomorrow at 2:00 PM with Meta",
      time: "1 day ago",
      icon: Users,
      isNew: false,
      color: "from-purple-500 to-pink-500"
    },
  ];

  // Employer menu items
  const employerMenuItems = [
    {
      title: "Post a Job",
      description: "Reach millions of qualified candidates",
      icon: PlusCircle,
      href: "/auth",
      color: "from-[#234C6A] to-[#456882]",
      badge: "Popular"
    },
    {
      title: "Recruiter Dashboard",
      description: "Manage applications & job listings",
      icon: LayoutDashboard,
      href: "/recruiter",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Search Candidates",
      description: "Find perfect matches for your roles",
      icon: Search,
      href: "/recruiter",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Analytics & Insights",
      description: "Track performance metrics",
      icon: TrendingUp,
      href: "/recruiter",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-[#234C6A]/5 border-b border-[#234C6A]/10"
          : "bg-[#E3E3E3]/95 backdrop-blur-lg border-b border-[#456882]/10"
      }`}
    >
      <div className="container flex h-16 lg:h-18 items-center justify-between mx-auto px-4 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl group z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-xl p-2 group-hover:scale-105 transition-transform">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
          </div>
          <span className="bg-gradient-to-r from-[#234C6A] to-[#456882] bg-clip-text text-transparent font-extrabold tracking-tight">
            JobHub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav ref={dropdownRef} className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive(item.href)
                  ? "text-[#234C6A]"
                  : "text-[#456882] hover:text-[#234C6A]"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-[#234C6A] to-[#456882] rounded-full" />
              )}
            </Link>
          ))}

          {/* For Employers Mega Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("employers")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeDropdown === "employers"
                  ? "text-[#234C6A] bg-[#234C6A]/5"
                  : "text-[#456882] hover:text-[#234C6A]"
              }`}
            >
              <Building2 className="h-4 w-4" />
              For Employers
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${activeDropdown === "employers" ? "rotate-180" : ""}`} />
            </button>

            {/* Employers Mega Menu */}
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-300 ${
                activeDropdown === "employers"
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2"
              }`}
            >
              <div className="w-[420px] bg-white rounded-2xl shadow-2xl shadow-[#234C6A]/10 border border-[#234C6A]/10 overflow-hidden">
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-[#234C6A] to-[#456882]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Hire Top Talent</h3>
                      <p className="text-sm text-white/80">Access millions of job seekers</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  {employerMenuItems.map((item, i) => (
                    <Link
                      key={i}
                      href={item.href}
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#E3E3E3]/50 transition-all duration-200 group"
                    >
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <item.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[#234C6A] group-hover:text-[#456882] transition-colors">
                            {item.title}
                          </p>
                          {item.badge && (
                            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-none text-xs px-2 py-0">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-[#456882]">{item.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#456882] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>

                {/* Footer CTA */}
                <div className="p-4 bg-gradient-to-r from-[#E3E3E3]/50 to-white border-t border-[#234C6A]/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-[#456882]">
                      <Shield className="h-4 w-4" />
                      <span>Trusted by 10,000+ companies</span>
                    </div>
                    <Link
                      href="/auth"
                      onClick={() => setActiveDropdown(null)}
                      className="text-sm font-semibold text-[#234C6A] hover:text-[#456882] flex items-center gap-1 transition-colors"
                    >
                      Get Started
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <>
              {/* Saved Jobs */}
              <Link href="/job/saved">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`relative h-10 w-10 rounded-xl transition-all duration-300 ${
                    isActive("/job/saved")
                      ? "text-[#234C6A] bg-[#234C6A]/10"
                      : "text-[#456882] hover:text-[#234C6A] hover:bg-[#234C6A]/5"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isActive("/job/saved") ? "fill-[#234C6A]" : ""}`} />
                </Button>
              </Link>

              {/* Notifications Dropdown */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleDropdown("notifications")}
                  className={`relative h-10 w-10 rounded-xl transition-all duration-300 ${
                    activeDropdown === "notifications"
                      ? "text-[#234C6A] bg-[#234C6A]/10"
                      : "text-[#456882] hover:text-[#234C6A] hover:bg-[#234C6A]/5"
                  }`}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-[10px] font-bold text-white items-center justify-center">
                      3
                    </span>
                  </span>
                </Button>

                {/* Notifications Panel */}
                <div
                  className={`absolute top-full right-0 pt-3 transition-all duration-300 ${
                    activeDropdown === "notifications"
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  }`}
                >
                  <div className="w-[380px] bg-white rounded-2xl shadow-2xl shadow-[#234C6A]/10 border border-[#234C6A]/10 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-[#E3E3E3] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center">
                          <Bell className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#234C6A]">Notifications</h3>
                          <p className="text-xs text-[#456882]">You have 3 new updates</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs text-[#456882] hover:text-[#234C6A]">
                        Mark all read
                      </Button>
                    </div>

                    {/* Notification Items */}
                    <div className="max-h-[320px] overflow-y-auto">
                      {notifications.map((item) => (
                        <Link
                          key={item.id}
                          href="/notifications"
                          onClick={() => setActiveDropdown(null)}
                          className={`flex items-start gap-4 p-4 transition-all duration-200 hover:bg-[#E3E3E3]/30 border-b border-[#E3E3E3]/50 last:border-0 ${
                            item.isNew ? "bg-gradient-to-r from-[#234C6A]/5 to-transparent" : ""
                          }`}
                        >
                          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                            <item.icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm font-medium truncate ${item.isNew ? "text-[#234C6A]" : "text-[#456882]"}`}>
                                {item.title}
                              </p>
                              {item.isNew && (
                                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#234C6A] to-[#456882] flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-xs text-[#456882] truncate mt-0.5">{item.description}</p>
                            <p className="text-xs text-[#456882]/70 mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.time}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="p-3 bg-[#E3E3E3]/30 border-t border-[#E3E3E3]">
                      <Link
                        href="/notifications"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center justify-center gap-2 w-full py-2 text-sm font-semibold text-[#234C6A] hover:text-[#456882] transition-colors"
                      >
                        View all notifications
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Menu Dropdown */}
              <div className="relative ml-1">
                <button
                  onClick={() => toggleDropdown("user")}
                  className={`flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-all duration-300 ${
                    activeDropdown === "user"
                      ? "bg-[#234C6A]/10"
                      : "hover:bg-[#234C6A]/5"
                  }`}
                >
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {user.name.charAt(0)}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-sm font-semibold text-[#234C6A] leading-tight">{user.name}</p>
                    <p className="text-xs text-[#456882] capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-[#456882] transition-transform duration-300 ${activeDropdown === "user" ? "rotate-180" : ""}`} />
                </button>

                {/* User Menu Panel */}
                <div
                  className={`absolute top-full right-0 pt-3 transition-all duration-300 ${
                    activeDropdown === "user"
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  }`}
                >
                  <div className="w-[280px] bg-white rounded-2xl shadow-2xl shadow-[#234C6A]/10 border border-[#234C6A]/10 overflow-hidden">
                    {/* Profile Header */}
                    <div className="p-4 bg-gradient-to-br from-[#234C6A] to-[#456882]">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl border-2 border-white/30">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white truncate">{user.name}</p>
                          <p className="text-sm text-white/70 truncate">{user.email}</p>
                          <Badge className="mt-1.5 bg-white/20 text-white border-white/30 text-xs capitalize">
                            <Star className="h-3 w-3 mr-1" />
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-px bg-[#E3E3E3]/50 border-b border-[#E3E3E3]">
                      {[
                        { label: "Applied", value: "12" },
                        { label: "Saved", value: "8" },
                        { label: "Views", value: "156" },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white p-3 text-center">
                          <p className="text-lg font-bold text-[#234C6A]">{stat.value}</p>
                          <p className="text-xs text-[#456882]">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      {userMenuItems.map((item, i) => (
                        <Link
                          key={i}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#E3E3E3]/50 transition-all duration-200 group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-[#234C6A]/10 flex items-center justify-center group-hover:bg-[#234C6A] transition-colors">
                            <item.icon className="h-4 w-4 text-[#234C6A] group-hover:text-white transition-colors" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#234C6A]">{item.label}</p>
                            <p className="text-xs text-[#456882]">{item.description}</p>
                          </div>
                          {item.label === "Notifications" && (
                            <Badge className="bg-red-500 text-white border-none text-xs">3</Badge>
                          )}
                        </Link>
                      ))}
                    </div>

                    {/* Logout */}
                    <div className="p-2 border-t border-[#E3E3E3]">
                      <button
                        onClick={() => {
                          handleLogout();
                          setActiveDropdown(null);
                        }}
                        className="flex items-center gap-3 w-full p-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200"
                      >
                        <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                          <LogOut className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                asChild
                className="text-[#234C6A] hover:text-[#456882] font-medium"
              >
                <Link href="/auth">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white shadow-lg hover:shadow-xl transition-all rounded-xl px-6"
              >
                <Link href="/auth">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile/Tablet Menu Button */}
        <button
          className="lg:hidden relative z-10 text-[#234C6A] p-2.5 rounded-xl hover:bg-[#234C6A]/10 transition-all duration-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className="w-6 h-5 flex flex-col justify-center items-center">
            <span className={`block h-0.5 w-6 bg-[#234C6A] rounded-full transform transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-0.5" : "-translate-y-1.5"}`} />
            <span className={`block h-0.5 w-6 bg-[#234C6A] rounded-full transition-all duration-300 ${mobileMenuOpen ? "opacity-0 scale-0" : "opacity-100"}`} />
            <span className={`block h-0.5 w-6 bg-[#234C6A] rounded-full transform transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-0.5" : "translate-y-1.5"}`} />
          </div>
        </button>
      </div>

      {/* Mobile/Tablet Navigation Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile/Tablet Navigation Panel */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 shadow-2xl transform transition-transform duration-500 ease-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="p-4 border-b border-[#E3E3E3] flex items-center justify-between bg-gradient-to-r from-[#234C6A] to-[#456882]">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg">JobHub</span>
          </Link>
          <button
            className="text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Profile (if logged in) */}
        {user && (
          <div className="p-4 border-b border-[#E3E3E3] bg-[#E3E3E3]/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white font-bold text-lg">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#234C6A]">{user.name}</p>
                <p className="text-sm text-[#456882]">{user.email}</p>
              </div>
              <Badge className="bg-[#234C6A]/10 text-[#234C6A] border-none capitalize text-xs">
                {user.role}
              </Badge>
            </div>
          </div>
        )}

        {/* Navigation Content */}
        <div className="overflow-y-auto h-[calc(100%-140px)] p-4">
          {/* Main Nav Items */}
          <div className="space-y-1 mb-6">
            <p className="text-xs font-semibold text-[#456882] uppercase tracking-wider px-3 mb-2">Menu</p>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-[#234C6A] to-[#456882] text-white shadow-lg"
                    : "text-[#234C6A] hover:bg-[#234C6A]/10"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
                {isActive(item.href) && <CheckCircle className="h-4 w-4 ml-auto" />}
              </Link>
            ))}
          </div>

          {/* For Employers Section */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-[#456882] uppercase tracking-wider px-3 mb-2">For Employers</p>
            <div className="space-y-1">
              {employerMenuItems.slice(0, 2).map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#234C6A] hover:bg-[#234C6A]/10 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-[#456882]">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu Items (if logged in) */}
          {user && (
            <div className="mb-6">
              <p className="text-xs font-semibold text-[#456882] uppercase tracking-wider px-3 mb-2">Account</p>
              <div className="space-y-1">
                {userMenuItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-[#234C6A] to-[#456882] text-white shadow-lg"
                        : "text-[#234C6A] hover:bg-[#234C6A]/10"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                    {item.label === "Notifications" && (
                      <Badge className="ml-auto bg-red-500 text-white border-none text-xs">3</Badge>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#E3E3E3] bg-white">
          {user ? (
            <button
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-red-500 bg-red-50 hover:bg-red-100 font-medium transition-all"
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white rounded-xl py-6"
              >
                <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full border-[#234C6A] text-[#234C6A] rounded-xl py-6"
              >
                <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
