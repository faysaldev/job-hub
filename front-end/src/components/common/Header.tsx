"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Briefcase, Menu, X, LogOut, User, Bell } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

// Mock user data - replace with actual auth context
export const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "jobseeker",
  avatar: "https://github.com/shadcn.png",
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const user = mockUser; // Replace with actual auth state
  // const user = null; // Replace with actual auth state

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    // In a real app, you would handle actual logout here
  };

  const getDashboardPath = () => {
    if (!user) return "/auth";
    return user?.role === "recruiter"
      ? "/recruiter/dashboard"
      : "/jobseeker/dashboard";
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-[#456882]/30 bg-[#E3E3E3]/95 backdrop-blur supports-[backdrop-filter]:bg-[#E3E3E3]/60 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="container flex h-16 items-center justify-between mx-auto">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-lg p-1.5">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-[#234C6A] to-[#456882] bg-clip-text text-transparent">
            JobHubs
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/jobs"
            className="text-sm font-medium text-[#234C6A] hover:text-[#456882] transition-colors"
          >
            Find Jobs
          </Link>
          <Link
            href="/jobs"
            className="text-sm font-medium text-[#234C6A] hover:text-[#456882] transition-colors"
          >
            For Employers
          </Link>
          <Link
            href="/jobs"
            className="text-sm font-medium text-[#234C6A] hover:text-[#456882] transition-colors"
          >
            How It Works
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Button variant="ghost" asChild className="text-[#234C6A]">
                <Link href="/job/saved">Saved Jobs</Link>
              </Button>

              {/* Notification button with unread count */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative p-0 w-8 h-8 text-[#234C6A]">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      3
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-2">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-[#234C6A]">Notifications</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-[#E3E3E3] text-[#234C6A]">
                        3 new
                      </span>
                    </div>
                    <div className="py-2">
                      <DropdownMenuItem asChild>
                        <Link href="/notifications" className="flex items-start gap-3 p-3 hover:bg-[#E3E3E3] rounded-lg border border-transparent hover:border-[#456882]/30">
                          <div className="bg-[#234C6A] rounded-full p-2 flex-shrink-0">
                            <Bell className="h-3 w-3 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#234C6A] truncate">New job matching your preferences</p>
                            <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/notifications" className="flex items-start gap-3 p-3 hover:bg-[#E3E3E3] rounded-lg border border-transparent hover:border-[#456882]/30">
                          <div className="bg-[#456882] rounded-full p-2 flex-shrink-0">
                            <Bell className="h-3 w-3 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#234C6A] truncate">Application status update</p>
                            <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/notifications" className="flex items-start gap-3 p-3 hover:bg-[#E3E3E3] rounded-lg border border-transparent hover:border-[#456882]/30">
                          <div className="bg-[#234C6A] rounded-full p-2 flex-shrink-0">
                            <Bell className="h-3 w-3 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#234C6A] truncate">Interview scheduled</p>
                            <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    </div>
                    <Link href="/notifications" className="block text-center text-sm text-[#456882] hover:underline p-2 mt-2 border-t border-[#456882]/20">
                      View all notifications
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-[#234C6A]">
                    <User className="h-4 w-4" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push(getDashboardPath())}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-[#234C6A]">
                <Link href="/auth">Sign In</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white">
                <Link href="/auth">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#234C6A]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#456882]/30 bg-[#E3E3E3]">
          <nav className="container py-4 flex flex-col gap-4">
            <Link
              href="/jobs"
              className="text-sm font-medium text-[#234C6A] hover:text-[#456882] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Jobs
            </Link>
            <Link
              href="/jobs"
              className="text-sm font-medium text-[#234C6A] hover:text-[#456882] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Employers
            </Link>
            <Link
              href="/jobs"
              className="text-sm font-medium text-[#234C6A] hover:text-[#456882] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              {user ? (
                <>
                  <Button
                    variant="outline"
                    className="border-[#234C6A] text-[#234C6A]"
                    onClick={() => {
                      router.push("/job/saved");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Saved Jobs
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#234C6A] text-[#234C6A]"
                    onClick={() => {
                      router.push("/notifications");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <div className="relative">
                      <Bell className="h-4 w-4 mr-2" />
                      <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        3
                      </span>
                    </div>
                    Notifications
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#234C6A] text-[#234C6A]"
                    onClick={() => {
                      router.push(getDashboardPath());
                      setMobileMenuOpen(false);
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#234C6A] text-[#234C6A]"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="border-[#234C6A] text-[#234C6A]">
                    <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white">
                    <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
