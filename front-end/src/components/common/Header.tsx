"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Briefcase, Menu, X, User, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

// Dummy user data for demonstration
const dummyUser = {
  name: "John Doe",
  role: "jobseeker",
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Dummy auth state
  const user = dummyUser; // Set to null to show login state
  const isLoggedIn = !!user;

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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="bg-gradient-to-br from-primary to-accent rounded-lg p-1.5">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            JobHubs
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/jobs"
            className={`text-sm font-medium transition-colors ${
              pathname === '/jobs'
                ? 'text-primary'
                : 'text-foreground hover:text-primary'
            }`}
          >
            Find Jobs
          </Link>
          <Link
            href="/employers"
            className={`text-sm font-medium transition-colors ${
              pathname === '/employers'
                ? 'text-primary'
                : 'text-foreground hover:text-primary'
            }`}
          >
            For Employers
          </Link>
          <Link
            href="/how-it-works"
            className={`text-sm font-medium transition-colors ${
              pathname === '/how-it-works'
                ? 'text-primary'
                : 'text-foreground hover:text-primary'
            }`}
          >
            How It Works
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user?.name || "User"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href={getDashboardPath()}>
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              href="/jobs"
              className={`text-sm font-medium transition-colors ${
                pathname === '/jobs'
                  ? 'text-primary'
                  : 'text-foreground hover:text-primary'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Jobs
            </Link>
            <Link
              href="/employers"
              className={`text-sm font-medium transition-colors ${
                pathname === '/employers'
                  ? 'text-primary'
                  : 'text-foreground hover:text-primary'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              For Employers
            </Link>
            <Link
              href="/how-it-works"
              className={`text-sm font-medium transition-colors ${
                pathname === '/how-it-works'
                  ? 'text-primary'
                  : 'text-foreground hover:text-primary'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              {isLoggedIn ? (
                <>
                  <Button
                    variant="outline"
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href={getDashboardPath()}>
                      Dashboard
                    </Link>
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
