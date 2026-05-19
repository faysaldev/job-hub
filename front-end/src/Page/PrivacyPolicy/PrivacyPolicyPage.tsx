"use client";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Cookie,
  Globe,
  Mail,
  ArrowRight,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import gsap from "gsap";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("intro");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-content",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(
        ".policy-content",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power2.out" }
      );
    });

    return () => ctx.revert();
  }, []);

  const sections = [
    { id: "intro", title: "Introduction", icon: <Shield className="h-4 w-4" /> },
    { id: "collection", title: "Information We Collect", icon: <Database className="h-4 w-4" /> },
    { id: "usage", title: "How We Use Your Data", icon: <Eye className="h-4 w-4" /> },
    { id: "protection", title: "Data Protection", icon: <Lock className="h-4 w-4" /> },
    { id: "rights", title: "Your Rights", icon: <CheckCircle className="h-4 w-4" /> },
    { id: "cookies", title: "Cookies Policy", icon: <Cookie className="h-4 w-4" /> },
    { id: "thirdparty", title: "Third-Party Services", icon: <Globe className="h-4 w-4" /> },
    { id: "contact", title: "Contact Us", icon: <Mail className="h-4 w-4" /> },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col jobhub-page-bg">
      <Header />

      <section className="relative overflow-hidden bg-[#234C6A] pt-32 pb-28 md:pt-40 md:pb-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute left-8 top-28 hidden h-28 w-64 rotate-[-8deg] rounded-[2rem] border border-white/10 bg-white/5 lg:block" />
          <div className="absolute bottom-14 right-10 hidden h-32 w-72 rotate-[7deg] rounded-[2rem] border border-white/10 bg-white/5 lg:block" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="hero-content mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur-sm">
              <Shield className="h-4 w-4" />
              <span>Your Privacy Matters</span>
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
              Privacy Policy built around trust and clarity.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-white/75">
              We are committed to protecting your personal information and being transparent about how we collect and use your data.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <span className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black uppercase tracking-wide text-white/90 backdrop-blur-sm">
                <FileText className="h-4 w-4" />
                Last Updated: January 15, 2026
              </span>
              <span className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black uppercase tracking-wide text-white/90 backdrop-blur-sm">
                <CheckCircle className="h-4 w-4" />
                GDPR Compliant
              </span>
              <span className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black uppercase tracking-wide text-white/90 backdrop-blur-sm">
                <Lock className="h-4 w-4" />
                CCPA Compliant
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <aside className="lg:col-span-1">
              <Card className="sticky top-28 overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 p-5 shadow-xl shadow-[#234C6A]/8 backdrop-blur-xl">
                <div className="mb-5 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#234C6A]/8 to-[#456882]/8 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#234C6A] text-white">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-[#234C6A]">Policy Sections</h3>
                    <p className="text-xs font-semibold text-[#456882]">Jump to a topic</p>
                  </div>
                </div>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all duration-300 relative group/item ${
                        activeSection === section.id
                          ? "bg-[#234C6A] text-white shadow-md translate-x-1"
                          : "text-[#456882] hover:bg-[#234C6A]/5 hover:text-[#234C6A] hover:translate-x-1"
                      }`}
                    >
                      {activeSection === section.id && (
                        <div className="absolute left-0 w-1 h-5 bg-white rounded-r-full" />
                      )}
                      <span className="flex-shrink-0 opacity-80 group-hover/item:opacity-100 transition-opacity">
                        {section.icon}
                      </span>
                      <span className="truncate">{section.title}</span>
                      <ChevronRight
                        className={`h-4 w-4 ml-auto transition-transform duration-300 ${
                          activeSection === section.id
                            ? "rotate-90"
                            : "opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1"
                        }`}
                      />
                    </button>
                  ))}
                </nav>
              </Card>
            </aside>

            <main className="lg:col-span-3 policy-content">
              <Card className="space-y-12 rounded-3xl border border-[#234C6A]/10 bg-white/95 p-7 shadow-2xl shadow-[#234C6A]/10 backdrop-blur md:p-10">
                {/* Introduction */}
                <section id="intro" className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white">
                      <Shield className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#234C6A]">
                      Introduction
                    </h2>
                  </div>
                  <p className="text-[#456882] leading-relaxed mb-4">
                    At JobHub, we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our recruitment platform and services.
                  </p>
                  <p className="text-[#456882] leading-relaxed">
                    By accessing or using JobHub, you agree to the collection and use of information in accordance with this policy. We encourage you to read this policy carefully to understand our practices regarding your personal data.
                  </p>
                </section>

                {/* Information We Collect */}
                <section id="collection" className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#234C6A] flex items-center justify-center text-white">
                      <Database className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#234C6A]">
                      Information We Collect
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-[#E3E3E3]/50 rounded-xl">
                      <h3 className="font-bold text-[#234C6A] mb-3">Personal Information</h3>
                      <ul className="space-y-2">
                        {[
                          "Name, email address, and phone number",
                          "Profile photo and professional headshot",
                          "Address and location information",
                          "Date of birth and gender (optional)",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-[#456882]">
                            <ChevronRight className="h-5 w-5 text-[#234C6A] flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 bg-[#E3E3E3]/50 rounded-xl">
                      <h3 className="font-bold text-[#234C6A] mb-3">Professional Information</h3>
                      <ul className="space-y-2">
                        {[
                          "Resume, CV, and cover letters",
                          "Work experience and employment history",
                          "Education and certifications",
                          "Skills, expertise, and portfolio",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-[#456882]">
                            <ChevronRight className="h-5 w-5 text-[#234C6A] flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 bg-[#E3E3E3]/50 rounded-xl">
                      <h3 className="font-bold text-[#234C6A] mb-3">Usage Data</h3>
                      <ul className="space-y-2">
                        {[
                          "Pages visited and time spent on site",
                          "Browser type and device information",
                          "IP address and location data",
                          "Search queries and job interactions",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-[#456882]">
                            <ChevronRight className="h-5 w-5 text-[#234C6A] flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* How We Use Your Data */}
                <section id="usage" className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#234C6A] flex items-center justify-center text-white">
                      <Eye className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#234C6A]">
                      How We Use Your Data
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "Service Delivery", desc: "To provide and maintain our recruitment platform" },
                      { title: "Personalization", desc: "To customize your experience and job recommendations" },
                      { title: "Communication", desc: "To send important updates and notifications" },
                      { title: "Analytics", desc: "To analyze usage patterns and improve our services" },
                      { title: "Security", desc: "To protect against fraud and unauthorized access" },
                      { title: "Legal Compliance", desc: "To comply with applicable laws and regulations" },
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-[#E3E3E3]/50 rounded-xl">
                        <h4 className="font-semibold text-[#234C6A] mb-1">{item.title}</h4>
                        <p className="text-sm text-[#456882]">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Data Protection */}
                <section id="protection" className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#234C6A] flex items-center justify-center text-white">
                      <Lock className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#234C6A]">
                      Data Protection
                    </h2>
                  </div>

                  <p className="text-[#456882] leading-relaxed mb-6">
                    We implement industry-leading security measures to protect your personal information from unauthorized access, use, alteration, or disclosure.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { icon: <Lock className="h-6 w-6" />, title: "Encryption", desc: "256-bit SSL encryption for all data transfers" },
                      { icon: <Shield className="h-6 w-6" />, title: "Secure Storage", desc: "Data stored in SOC 2 certified data centers" },
                      { icon: <Eye className="h-6 w-6" />, title: "Access Control", desc: "Role-based access and multi-factor authentication" },
                    ].map((item, i) => (
                      <Card key={i} className="p-6 border-none bg-gradient-to-br from-[#234C6A] to-[#456882] text-white">
                        <div className="mb-3">{item.icon}</div>
                        <h4 className="font-bold mb-2">{item.title}</h4>
                        <p className="text-sm text-white/80">{item.desc}</p>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Your Rights */}
                <section id="rights" className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#234C6A] flex items-center justify-center text-white">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#234C6A]">
                      Your Rights
                    </h2>
                  </div>

                  <p className="text-[#456882] leading-relaxed mb-6">
                    Under GDPR, CCPA, and other data protection laws, you have the following rights regarding your personal data:
                  </p>

                  <div className="space-y-3">
                    {[
                      { right: "Right to Access", desc: "Request a copy of your personal data" },
                      { right: "Right to Rectification", desc: "Correct inaccurate or incomplete data" },
                      { right: "Right to Erasure", desc: "Request deletion of your personal data" },
                      { right: "Right to Restrict Processing", desc: "Limit how we use your data" },
                      { right: "Right to Data Portability", desc: "Receive your data in a portable format" },
                      { right: "Right to Withdraw Consent", desc: "Withdraw consent at any time" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-[#E3E3E3]/50 rounded-xl">
                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-[#234C6A]">{item.right}:</span>
                          <span className="text-[#456882] ml-2">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Cookies */}
                <section id="cookies" className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#234C6A] flex items-center justify-center text-white">
                      <Cookie className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#234C6A]">
                      Cookies Policy
                    </h2>
                  </div>

                  <p className="text-[#456882] leading-relaxed mb-6">
                    We use cookies and similar tracking technologies to enhance your experience on our platform. You can manage your cookie preferences through your browser settings.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#234C6A] text-white">
                          <th className="px-4 py-3 text-left rounded-tl-lg">Cookie Type</th>
                          <th className="px-4 py-3 text-left">Purpose</th>
                          <th className="px-4 py-3 text-left rounded-tr-lg">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E3E3E3]">
                        {[
                          { type: "Essential", purpose: "Required for basic site functionality", duration: "Session" },
                          { type: "Analytics", purpose: "Help us understand site usage", duration: "2 years" },
                          { type: "Marketing", purpose: "Personalized advertising", duration: "1 year" },
                          { type: "Preferences", purpose: "Remember your settings", duration: "1 year" },
                        ].map((cookie, i) => (
                          <tr key={i} className="bg-white">
                            <td className="px-4 py-3 font-medium text-[#234C6A]">{cookie.type}</td>
                            <td className="px-4 py-3 text-[#456882]">{cookie.purpose}</td>
                            <td className="px-4 py-3 text-[#456882]">{cookie.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Third-Party Services */}
                <section id="thirdparty" className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#234C6A] flex items-center justify-center text-white">
                      <Globe className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#234C6A]">
                      Third-Party Services
                    </h2>
                  </div>

                  <p className="text-[#456882] leading-relaxed mb-6">
                    We work with trusted third-party service providers to deliver our services. These providers have their own privacy policies and are bound by strict data protection agreements.
                  </p>

                  <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex gap-3">
                      <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-amber-800 mb-2">Important Notice</h4>
                        <p className="text-amber-700 text-sm">
                          We encourage you to review the privacy policies of any third-party services you interact with through our platform. We are not responsible for the privacy practices of external websites or services.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contact */}
                <section id="contact" className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white">
                      <Mail className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#234C6A]">
                      Contact Us
                    </h2>
                  </div>

                  <p className="text-[#456882] leading-relaxed mb-6">
                    If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact our Data Protection Officer:
                  </p>

                  <Card className="p-6 border-none bg-gradient-to-br from-[#234C6A] to-[#456882] text-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold mb-2">Email</h4>
                        <p className="text-white/80">privacy@jobhub.com</p>
                      </div>
                      <div>
                        <h4 className="font-bold mb-2">Address</h4>
                        <p className="text-white/80">123 Business Avenue<br />San Francisco, CA 94107</p>
                      </div>
                    </div>
                  </Card>
                </section>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-[#E3E3E3]">
                  <Link href="/">
                    <Button className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white group">
                      Return to Homepage
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/terms-of-service">
                    <Button variant="outline" className="border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10">
                      View Terms of Service
                    </Button>
                  </Link>
                </div>
              </Card>
            </main>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
