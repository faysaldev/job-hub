import type { Metadata } from "next";
import TeamWorkspace from "@/src/components/hiring/TeamWorkspace";
export const metadata: Metadata = { title: "Team and invitations | JobHub", robots: { index: false, follow: false } };
export default function Page() { return <TeamWorkspace/>; }
