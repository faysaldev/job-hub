"use client";
import type { ReactNode } from "react";
import WorkspaceShell from "@/src/components/layout/WorkspaceShell";
export default function RecruiterLayout({ children }: { children: ReactNode }) {
  return <WorkspaceShell role="recruiter">{children}</WorkspaceShell>;
}
