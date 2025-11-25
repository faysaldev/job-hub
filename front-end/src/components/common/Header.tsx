"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Briefcase, Menu, X, LogOut, Bell, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/src/components/ui/dropdown-menu";

// Mock user data - replace with actual auth context
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  role: "jobseeker",
  avatar: "https://github.com/shadcn.png",
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Mock auth state - replace with actual auth context
  const user = mockUser; // Replace with actual auth state
  const isLoggedIn = !!user;

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
    return user.role === "recruiter"
      ? "/recruiter/dashboard"
      : "/jobseeker/dashboard";
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
          : "bg-transparent border-b-0"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="bg-gradient-to-br from-primary to-accent rounded-lg p-1.5 shadow-sm">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            JobHubs
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === "/"
                ? "text-primary"
                : "text-foreground hover:text-primary"
            }`}
          >
            Home
          </Link>
          <Link
            href="/jobs"
            className={`text-sm font-medium transition-colors ${
              pathname === "/jobs"
                ? "text-primary"
                : "text-foreground hover:text-primary"
            }`}
          >
            Find Jobs
          </Link>
          <Link
            href="/employers"
            className={`text-sm font-medium transition-colors ${
              pathname === "/employers"
                ? "text-primary"
                : "text-foreground hover:text-primary"
            }`}
          >
            For Employers
          </Link>
          <Link
            href="/how-it-works"
            className={`text-sm font-medium transition-colors ${
              pathname === "/how-it-works"
                ? "text-primary"
                : "text-foreground hover:text-primary"
            }`}
          >
            How It Works
          </Link>
          <Link
            href="/services"
            className={`text-sm font-medium transition-colors ${
              pathname === "/services"
                ? "text-primary"
                : "text-foreground hover:text-primary"
            }`}
          >
            Services
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* Notification Bell */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* Settings */}
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                      <img
                        src={user?.avatar || "https://github.com/shadcn.png"}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="hidden md:inline">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-3 p-3">
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                      <img
                        src={user?.avatar || "https://github.com/shadcn.png"}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="grid gap-0.5">
                      <p className="font-medium text-sm">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={getDashboardPath()}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/saved-jobs">Saved Jobs</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth">Sign In</Link>
              </Button>
              <Button asChild className="bg-accent hover:bg-accent/90">
                <Link href="/auth">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
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
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container py-4 flex flex-col gap-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/jobs"
              className={`text-sm font-medium transition-colors ${
                pathname === "/jobs"
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Jobs
            </Link>
            <Link
              href="/employers"
              className={`text-sm font-medium transition-colors ${
                pathname === "/employers"
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              For Employers
            </Link>
            <Link
              href="/how-it-works"
              className={`text-sm font-medium transition-colors ${
                pathname === "/how-it-works"
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/services"
              className={`text-sm font-medium transition-colors ${
                pathname === "/services"
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>

            <div className="flex flex-col gap-2 pt-2">
              {isLoggedIn ? (
                <>
                  <Button
                    variant="outline"
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href={getDashboardPath()}>Dashboard</Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href="/profile">Profile</Link>
                  </Button>
                  <Button
                    variant="outline"
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
                  <Button variant="outline" asChild>
                    <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="bg-accent hover:bg-accent/90">
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
