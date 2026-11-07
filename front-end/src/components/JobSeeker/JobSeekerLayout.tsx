"use client";
import type { ReactNode } from "react";
import WorkspaceShell from "@/src/components/layout/WorkspaceShell";
export default function JobSeekerLayout({ children }: { children: ReactNode }) {
  return <WorkspaceShell role="seeker">{children}</WorkspaceShell>;
}
