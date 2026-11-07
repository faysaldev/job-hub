"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, BriefcaseBusiness, Building2, CalendarDays, FileText, LayoutDashboard, Menu, MessageSquare, Plus, UserRound, Users, X } from "lucide-react";
import Header from "@/src/components/common/Header";
import { useAuth } from "@/src/hooks/useAuth";
import { useAppSelector } from "@/src/redux/hooks";
import { WorkspaceLoading } from "@/src/components/feedback/LoadingStates";

type WorkspaceRole = "recruiter" | "seeker";
const recruiterLinks = [
  { href: "/recruiter", label: "Overview", icon: LayoutDashboard },
  { href: "/recruiter/jobs", label: "Job listings", icon: BriefcaseBusiness },
  { href: "/recruiter/create-job", label: "Create job", icon: Plus },
  { href: "/recruiter/applicants", label: "Applicants", icon: Users },
  { href: "/recruiter/messages", label: "Messages", icon: MessageSquare },
  { href: "/recruiter/interview-schedule", label: "Interviews", icon: CalendarDays },
  { href: "/recruiter/company", label: "Company profile", icon: Building2 },
];
const seekerLinks = [
  { href: "/job-seeker", label: "Overview", icon: LayoutDashboard },
  { href: "/job-seeker/applications", label: "My applications", icon: FileText },
  { href: "/job/saved", label: "Saved jobs", icon: BriefcaseBusiness },
  { href: "/job-seeker/messages", label: "Messages", icon: MessageSquare },
  { href: "/job-seeker/interviews", label: "Interviews", icon: CalendarDays },
  { href: "/job-seeker/profile", label: "My profile", icon: UserRound },
];

export default function WorkspaceShell({ role, children }: { role: WorkspaceRole; children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const rehydrated = useAppSelector(state => state.auth._persist?.rehydrated ?? false);
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    if (!rehydrated) return;
    if (user && user.role !== role) router.replace(user.role === "recruiter" ? "/recruiter" : user.role === "seeker" ? "/job-seeker" : "/");
    else if (!isAuthenticated) router.replace("/auth");
  }, [isAuthenticated, rehydrated, role, router, user]);
  useEffect(() => {
    if (!mobileOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [mobileOpen]);

  if (!rehydrated || !user || user.role !== role) return <WorkspaceLoading />;
  const nav = role === "recruiter" ? recruiterLinks : seekerLinks;
  return (
    <div className="jobhub-workspace">
      <Header />
      <div className="jh-workspace-shell">
        {mobileOpen && <button type="button" aria-label="Close workspace menu" className="fixed inset-0 z-[60] bg-[#0c243b]/55 lg:hidden" onClick={() => setMobileOpen(false)} />}
        <aside id="jh-workspace-nav" className="jh-workspace-sidebar" data-open={mobileOpen} aria-label={`${role === "recruiter" ? "Recruiter" : "Candidate"} workspace navigation`}>
          <div className="mb-6 flex items-center justify-between border-b border-[#e1e8ef] px-3 pb-5">
            <div><p className="jh-kicker">Workspace</p><p className="mt-1 text-lg font-semibold text-[#162839]">{role === "recruiter" ? "Recruiting" : "My career"}</p></div>
            <button type="button" className="jh-icon-button lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close workspace navigation"><X size={18} /></button>
          </div>
          <p className="jh-sidebar-label">Manage</p>
          <nav className="jh-workspace-nav" aria-label="Workspace sections">
            {nav.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (pathname.startsWith(`${href}/`) && href !== "/recruiter" && href !== "/job-seeker");
              return <Link key={href} href={href} aria-current={active ? "page" : undefined} className="jh-sidebar-link" onClick={() => setMobileOpen(false)}><Icon aria-hidden="true" size={18} /><span>{label}</span></Link>;
            })}
          </nav>
          <div className="mt-8 border-t border-[#e1e8ef] pt-4">
            <p className="jh-sidebar-label">Account</p>
            <Link href="/notifications" className="jh-sidebar-link"><Bell aria-hidden="true" size={18} />Notifications</Link>
            <Link href="/job" className="jh-sidebar-link"><BriefcaseBusiness aria-hidden="true" size={18} />Browse jobs</Link>
          </div>
        </aside>
        <main className="jh-workspace-main" id="main-content" tabIndex={-1}>
          <div className="border-b border-[#e1e8ef] bg-white px-4 py-3 lg:hidden">
            <button type="button" className="jh-button jh-button--outline" aria-expanded={mobileOpen} aria-controls="jh-workspace-nav" onClick={() => setMobileOpen(true)}><Menu size={17} /> Workspace menu</button>
          </div>
          <div className="jh-workspace-inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
