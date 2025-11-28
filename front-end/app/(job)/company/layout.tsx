import { ReactNode } from "react";

export default function CompanyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#E3E3E3]">
      {children}
    </div>
  );
}