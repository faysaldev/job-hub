"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BriefcaseBusiness, ChevronDown, LayoutDashboard, LogOut, Menu, Plus, X } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { useGetHeaderStatsQuery } from "@/src/redux/features/generals/generalsApi";

const siteLinks = [
  { href: "/", label: "Home" },
  { href: "/job", label: "Find jobs" },
  { href: "/companies", label: "Companies" },
  { href: "/candidates", label: "Find talent" },
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
  return (
    <header className="jh-site-header">
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      <div className="jh-container jh-header-inner">
        <Link href="/" className="jh-logo" aria-label="JobHub home">
          <span className="jh-logo-mark"><BriefcaseBusiness size={18} aria-hidden="true" /></span>
          JobHub
        </Link>
        <nav className="jh-nav hidden lg:flex" aria-label="Main navigation">
          {siteLinks.map(({ href, label }) => (
            <Link className="jh-nav-link" data-active={pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))}
              aria-current={pathname === href ? "page" : undefined} href={href} key={href}>{label}</Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          {isAuthenticated ? (
            <>
              <Link href="/notifications" className="jh-icon-button relative" aria-label={unread ? `${unread} unread notifications` : "Notifications"}>
                <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
                {unread > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-[#bb4652] px-1.5 text-[10px] font-semibold leading-5 text-white">{unread > 99 ? "99+" : unread}</span>}
              </Link>
              {user?.role === "recruiter" && <Link href="/recruiter/create-job" className="jh-button"><Plus size={16} /> Post a job</Link>}
              <div className="relative">
                <button type="button" className="jh-button jh-button--outline" aria-expanded={profileOpen} aria-controls="jh-account-menu" onClick={() => setProfileOpen(!profileOpen)}>
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#e7eff6] text-xs text-[#163b5c]" aria-hidden="true">{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
                  <span className="max-w-28 truncate">{user?.name || "Account"}</span><ChevronDown size={14} />
                </button>
                {profileOpen && <div id="jh-account-menu" className="absolute right-0 top-[calc(100%+10px)] z-50 w-56 rounded-xl border border-[#e1e8ef] bg-white p-2 shadow-lg" role="menu">
                  <p className="truncate border-b border-[#e1e8ef] px-3 py-2 text-xs text-[#66798a]">{user?.email}</p>
                  <Link href={dashboard} className="jh-nav-link w-full" role="menuitem"><LayoutDashboard size={16} /> Dashboard</Link>
                  <Link href="/notifications" className="jh-nav-link w-full" role="menuitem"><Bell size={16} /> Notifications</Link>
                  <button type="button" className="jh-nav-link w-full text-left" role="menuitem" onClick={logout}><LogOut size={16} /> Sign out</button>
                </div>}
              </div>
            </>
          ) : (
            <><Link href="/auth" className="jh-button jh-button--ghost">Sign in</Link><Link href="/auth" className="jh-button">Get started</Link></>
          )}
        </div>
        <button type="button" className="jh-icon-button ml-auto lg:hidden" onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-controls="jh-mobile-navigation" aria-expanded={menuOpen}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {menuOpen && <nav id="jh-mobile-navigation" aria-label="Mobile navigation" className="jh-mobile-panel lg:hidden">
        <div className="jh-container space-y-1 py-4">
          {siteLinks.map(({ href, label }) => <Link key={href} href={href} className="jh-nav-link" aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
          {isAuthenticated ? <>
            <Link href={dashboard} className="jh-nav-link"><LayoutDashboard size={16} /> Dashboard</Link>
            <Link href="/notifications" className="jh-nav-link"><Bell size={16} /> Notifications {unread > 0 ? `(${unread})` : ""}</Link>
            {user?.role === "recruiter" && <Link href="/recruiter/create-job" className="jh-nav-link"><Plus size={16} /> Post a job</Link>}
            <button type="button" className="jh-nav-link" onClick={logout}><LogOut size={16} /> Sign out</button>
          </> : <Link href="/auth" className="jh-button mt-3 w-full">Sign in or create account</Link>}
        </div>
      </nav>}
    </header>
  );
}
