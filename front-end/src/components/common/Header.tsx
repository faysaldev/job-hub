"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, LayoutDashboard, LogOut, Menu, Plus, X } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { useGetHeaderStatsQuery } from "@/src/redux/features/generals/generalsApi";

const siteLinks = [
  { href: "/job", label: "Finds Jobs" },
  { href: "/companies", label: "Company Reviews" },
  { href: "/candidates", label: "Find Resumes" },
  { href: "/about", label: "About Us" },
];

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { data: stats } = useGetHeaderStatsQuery(undefined, { skip: !isAuthenticated });
  const dashboard = user?.role === "recruiter" ? "/recruiter" : user?.role === "seeker" ? "/job-seeker" : "/";
  const unread = stats?.unreadNotificationsCount ?? 0;

  useEffect(() => { setMenuOpen(false); setProfileOpen(false); }, [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [menuOpen]);

  useEffect(() => {
    if (!profileOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setProfileOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [profileOpen]);

  const userRoleDisplay = user?.role === "recruiter"
    ? "Recruiter"
    : user?.role === "seeker"
    ? "Candidate"
    : "Member";

  return (
    <header className="jh-site-header">
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      <div className="jh-container jh-header-inner">
        {/* Brand Logo styled exactly like YO ! JOB in reference */}
        <Link href="/" className="jh-logo flex items-center gap-2 group select-none" aria-label="JOB ! HUB home">
          <div className="flex flex-col leading-none">
            <span className="text-[12px] font-black tracking-widest text-white">JOB !</span>
            <span className="text-sm font-black tracking-tight text-neutral-300">HUB</span>
          </div>
        </Link>

        {/* Center Navigation Links with active pill indicators */}
        <nav className="jh-nav hidden lg:flex ml-4" aria-label="Main navigation">
          {siteLinks.map(({ href, label }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
            return (
              <Link
                key={href}
                href={href}
                className="jh-nav-link"
                data-active={isActive}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side authentication & user capsule */}
        <div className="ml-auto hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <Link
                href="/notifications"
                className="relative grid h-9 w-9 place-items-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                aria-label={unread ? `${unread} unread notifications` : "Notifications"}
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                {unread > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}
              </Link>

              {user?.role === "recruiter" && (
                <Link
                  href="/recruiter/create-job"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-neutral-800 transition-colors"
                >
                  <Plus size={13} />
                  Post Job
                </Link>
              )}

              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-2.5 rounded-xl border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-left transition-colors hover:border-neutral-700"
                  aria-expanded={profileOpen}
                  aria-controls="jh-account-menu"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-neutral-800 text-xs font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="hidden min-w-0 xl:block">
                    <p className="truncate text-xs font-semibold text-white leading-tight">
                      {user?.name || "My Account"}
                    </p>
                    <p className="truncate text-[10px] text-neutral-400 leading-tight">
                      {userRoleDisplay}
                    </p>
                  </div>
                  <ChevronDown size={14} className="text-neutral-400" />
                </button>

                {profileOpen && (
                  <div
                    id="jh-account-menu"
                    className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 rounded-xl border border-neutral-800 bg-[#0f0f11] p-1.5 shadow-xl text-white"
                    role="menu"
                  >
                    <p className="truncate border-b border-neutral-800 px-3 py-2 text-xs text-neutral-400">
                      {user?.email}
                    </p>
                    <Link
                      href={dashboard}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-neutral-200 hover:bg-neutral-800 hover:text-white"
                      role="menuitem"
                    >
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>
                    <Link
                      href="/notifications"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-neutral-200 hover:bg-neutral-800 hover:text-white"
                      role="menuitem"
                    >
                      <Bell size={14} /> Notifications
                    </Link>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-red-400 hover:bg-neutral-800 hover:text-red-300"
                      role="menuitem"
                      onClick={logout}
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="text-xs font-semibold text-neutral-300 hover:text-white px-2.5 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-black hover:bg-neutral-200 transition-colors shadow-2xs"
              >
                Employers / Post Job
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger toggle */}
        <button
          type="button"
          className="jh-icon-button ml-auto lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-controls="jh-mobile-navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile navigation panel */}
      {menuOpen && (
        <nav id="jh-mobile-navigation" aria-label="Mobile navigation" className="jh-mobile-panel lg:hidden">
          <div className="jh-container space-y-1.5 py-4">
            {siteLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="jh-nav-link"
                data-active={pathname === href}
                aria-current={pathname === href ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
            {isAuthenticated ? (
              <div className="pt-3 border-t border-neutral-800 space-y-1">
                <Link href={dashboard} className="jh-nav-link"><LayoutDashboard size={16} /> Dashboard</Link>
                <Link href="/notifications" className="jh-nav-link"><Bell size={16} /> Notifications {unread > 0 ? `(${unread})` : ""}</Link>
                {user?.role === "recruiter" && <Link href="/recruiter/create-job" className="jh-nav-link"><Plus size={16} /> Post a job</Link>}
                <button type="button" className="jh-nav-link text-red-400" onClick={logout}><LogOut size={16} /> Sign out</button>
              </div>
            ) : (
              <div className="pt-3 border-t border-neutral-800 space-y-2">
                <Link href="/auth" className="jh-button w-full bg-white text-black hover:bg-neutral-200">Sign In</Link>
                <Link href="/auth" className="jh-button w-full border border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800">Employers / Post Job</Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
