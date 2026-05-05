import Footer from "@/src/components/common/Footer";
import Header from "@/src/components/common/Header";
import { ReactNode } from "react";

export default function CompanyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#E3E3E3]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
