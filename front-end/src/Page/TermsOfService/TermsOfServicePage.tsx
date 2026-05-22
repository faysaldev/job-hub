"use client";
import { useEffect, useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  FileText,
  Scale,
  UserCheck,
  ShieldAlert,
  FileWarning,
  Gavel,
  RefreshCw,
  Mail,
  ArrowRight,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import gsap from "gsap";
import Link from "next/link";

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState("acceptance");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-content",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(
        ".terms-content",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power2.out" }
      );
    });

    return () => ctx.revert();
  }, []);

  const sections = [
    { id: "acceptance", title: "Acceptance of Terms", icon: <CheckCircle className="h-4 w-4" /> },
    { id: "license", title: "Use License", icon: <FileText className="h-4 w-4" /> },
    { id: "accounts", title: "User Accounts", icon: <UserCheck className="h-4 w-4" /> },
    { id: "prohibited", title: "Prohibited Uses", icon: <ShieldAlert className="h-4 w-4" /> },
    { id: "content", title: "Content Guidelines", icon: <FileWarning className="h-4 w-4" /> },
    { id: "liability", title: "Limitation of Liability", icon: <Scale className="h-4 w-4" /> },
    { id: "governing", title: "Governing Law", icon: <Gavel className="h-4 w-4" /> },
    { id: "changes", title: "Changes to Terms", icon: <RefreshCw className="h-4 w-4" /> },
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
              <Scale className="h-4 w-4" />
              <span>Legal Agreement</span>
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
              Terms of Service for the JobHub platform.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-white/75">
              Please read these terms carefully before using JobHub. By accessing our platform, you agree to be bound by these terms.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <span className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black uppercase tracking-wide text-white/90 backdrop-blur-sm">
                <Clock className="h-4 w-4" />
                Last Updated: January 15, 2026
              </span>
              <span className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black uppercase tracking-wide text-white/90 backdrop-blur-sm">
                <FileText className="h-4 w-4" />
                Version 3.0
              </span>
              <span className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black uppercase tracking-wide text-white/90 backdrop-blur-sm">
                <Gavel className="h-4 w-4" />
                California Law
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
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-[#234C6A]">Contents</h3>
                    <p className="text-xs font-semibold text-[#456882]">Jump to a section</p>
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
                <div className="mt-6 rounded-2xl border border-[#234C6A]/10 bg-[#F8FAFC] p-4">
                  <h4 className="mb-2 text-sm font-black text-[#234C6A]">Quick Summary</h4>
                  <p className="text-xs leading-5 text-[#456882]">
                    By using JobHub, you agree to our terms, including our content policies and limitation of liability.
                  </p>
                </div>
              </Card>
            </aside>

            <main className="lg:col-span-3 terms-content">
              <Card className="space-y-12 rounded-3xl border border-[#234C6A]/10 bg-white/95 p-7 shadow-2xl shadow-[#234C6A]/10 backdrop-blur md:p-10">
                {/* Important Notice */}
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl mb-10">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Important Notice</h4>
                      <p className="text-blue-700 text-sm">
                        These Terms of Service constitute a legally binding agreement between you and JobHub, Inc. Please read them carefully. If you do not agree with any part of these terms, you should not use our services.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Acceptance of Terms */}
                <section id="acceptance" className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#234C6A]">
                      Acceptance of Terms
                    </h2>
                  </div>
                  <p className="text-[#456882] leading-relaxed mb-4">
                    These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the JobHub platform, including our website, applications, and services (collectively, &ldquo;Services&rdquo;), operated by JobHub, Inc. (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
                  </p>
                  <p className="text-[#456882] leading-relaxed mb-4">
                    By accessing or using our Services, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access our Services. These Terms apply to all visitors, users, and others who access or use our Services.
                  </p>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">By continuing to use JobHub, you confirm that you have read and agree to these Terms.</span>
                    </div>
                  </div>
                </section>

                {/* Use License */}
                <section id="license" className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#234C6A] flex items-center justify-center text-white">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#234C6A]">
                      Use License
                    </h2>
                  </div>
                  <p className="text-[#456882] leading-relaxed mb-6">
                    Subject to these Terms, JobHub grants you a limited, non-exclusive, non-transferable, revocable license to use our Services for your personal or internal business purposes.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        You May:
                      </h4>
                      <ul className="space-y-2 text-sm text-green-700">
                        {[
                          "Access and use the platform for job searching",
                          "Post legitimate job listings (employers)",
                          "Apply to jobs and manage applications",
                          "Create and maintain your professional profile",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                        <XCircle className="h-5 w-5" />
                        You May Not:
                      </h4>
                      <ul className="space-y-2 text-sm text-red-700">
                        {[
                          "Resell or commercially exploit the platform",
                          "Copy or redistribute our content",
                          "Modify or create derivative works",
                          "Use automated tools to scrape data",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* User Accounts */}
                <section id="accounts" className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#234C6A] flex items-center justify-center text-white">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#234C6A]">
                      User Accounts
                    </h2>
                  </div>

                  <p className="text-[#456882] leading-relaxed mb-6">
                    When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the security of your account and for all activities that occur under your account.
                  </p>

                  <div className="space-y-4">
                    {[
                      {
                        title: "Account Creation",
                        desc: "You must be at least 18 years old and provide accurate, current, and complete information during registration.",
                      },
                      {
                        title: "Account Security",
                        desc: "You are responsible for safeguarding your password and for any activities under your account. Notify us immediately of any unauthorized use.",
                      },
                      {
                        title: "Account Types",
                        desc: "Different account types (Job Seeker, Recruiter, Enterprise) have different features and limitations as described in our service tiers.",
                      },
                      {
                        title: "Account Termination",
                        desc: "We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.",
                      },
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-[#E3E3E3]/50 rounded-xl">
                        <h4 className="font-semibold text-[#234C6A] mb-1">{item.title}</h4>
                        <p className="text-sm text-[#456882]">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Prohibited Uses */}
                <section id="prohibited" className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#234C6A] flex items-center justify-center text-white">
                      <ShieldAlert className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#234C6A]">
                      Prohibited Uses
                    </h2>
                  </div>

                  <p className="text-[#456882] leading-relaxed mb-6">
                    You may not access or use our Services for any purpose that is unlawful or prohibited by these Terms. The following activities are strictly prohibited:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "Illegal Activities", desc: "Using the platform for any unlawful purpose or to violate laws" },
                      { title: "Spam & Advertising", desc: "Sending unsolicited promotional materials or advertisements" },
                      { title: "Impersonation", desc: "Impersonating others or misrepresenting your identity" },
                      { title: "System Interference", desc: "Attempting to damage, disable, or overburden our servers" },
                      { title: "Data Mining", desc: "Scraping, harvesting, or collecting user data without consent" },
                      { title: "Malicious Content", desc: "Uploading viruses, malware, or other harmful code" },
                      { title: "Fake Listings", desc: "Posting fraudulent job listings or fake profiles" },
                      { title: "Discrimination", desc: "Discriminating against users based on protected characteristics" },
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-red-800">{item.title}</h4>
                          <p className="text-sm text-red-600">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Content Guidelines */}
                <section id="content" className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#234C6A] flex items-center justify-center text-white">
                      <FileWarning className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#234C6A]">
                      Content Guidelines
                    </h2>
                  </div>

                  <p className="text-[#456882] leading-relaxed mb-6">
                    Our Services may contain content provided by users, companies, or other third parties. All content is the sole responsibility of the entity that created it.
                  </p>

                  <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl mb-6">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-amber-800 mb-2">Content Disclaimer</h4>
                        <p className="text-amber-700 text-sm">
                          JobHub does not control and is not responsible for any user-generated content, including its accuracy, completeness, or reliability. Users are solely responsible for the content they post.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-[#234C6A]">Your Responsibilities:</h4>
                    {[
                      "Ensure all content you post is accurate and truthful",
                      "Obtain necessary permissions for any content you share",
                      "Not post content that infringes intellectual property rights",
                      "Report inappropriate or misleading content to our team",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-[#E3E3E3]/50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-[#456882]">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Limitation of Liability */}
                <section id="liability" className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#234C6A] flex items-center justify-center text-white">
                      <Scale className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#234C6A]">
                      Limitation of Liability
                    </h2>
                  </div>

                  <p className="text-[#456882] leading-relaxed mb-6">
                    In no event shall JobHub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation:
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {[
                      "Loss of profits",
                      "Loss of data",
                      "Loss of use",
                      "Loss of goodwill",
                      "Business interruption",
                      "Intangible losses",
                    ].map((item, i) => (
                      <div key={i} className="p-3 bg-[#E3E3E3]/50 rounded-lg text-center">
                        <span className="text-sm font-medium text-[#234C6A]">{item}</span>
                      </div>
                    ))}
                  </div>

                  <Card className="p-6 border-none bg-gradient-to-br from-[#234C6A] to-[#456882] text-white">
                    <h4 className="font-bold mb-3">Maximum Liability</h4>
                    <p className="text-white/80 text-sm">
                      Our total liability to you for any claims arising from or related to these Terms or your use of the Services shall not exceed the greater of: (a) the amount you paid to JobHub in the 12 months prior to the claim, or (b) $100 USD.
                    </p>
                  </Card>
                </section>

                {/* Governing Law */}
                <section id="governing" className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#234C6A] flex items-center justify-center text-white">
                      <Gavel className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#234C6A]">
                      Governing Law
                    </h2>
                  </div>

                  <p className="text-[#456882] leading-relaxed mb-4">
                    These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
                  </p>

                  <p className="text-[#456882] leading-relaxed mb-6">
                    Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#E3E3E3]/50 rounded-xl">
                      <h4 className="font-semibold text-[#234C6A] mb-2">Jurisdiction</h4>
                      <p className="text-sm text-[#456882]">State of California, United States</p>
                    </div>
                    <div className="p-4 bg-[#E3E3E3]/50 rounded-xl">
                      <h4 className="font-semibold text-[#234C6A] mb-2">Dispute Resolution</h4>
                      <p className="text-sm text-[#456882]">Binding arbitration in San Francisco, CA</p>
                    </div>
                  </div>
                </section>

                {/* Changes to Terms */}
                <section id="changes" className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white">
                      <RefreshCw className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#234C6A]">
                      Changes to Terms
                    </h2>
                  </div>

                  <p className="text-[#456882] leading-relaxed mb-4">
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                  </p>

                  <p className="text-[#456882] leading-relaxed mb-6">
                    What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Services after those revisions become effective, you agree to be bound by the revised terms.
                  </p>

                  <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex gap-3">
                      <Mail className="h-6 w-6 text-blue-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">Stay Informed</h4>
                        <p className="text-blue-700 text-sm mb-3">
                          We will notify you of any material changes via email or through a prominent notice on our platform.
                        </p>
                        <p className="text-blue-700 text-sm">
                          For questions about these Terms, contact us at: <strong>legal@jobhub.com</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-[#E3E3E3]">
                  <Link href="/">
                    <Button className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white group">
                      Return to Homepage
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/privacy-policy">
                    <Button variant="outline" className="border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10">
                      View Privacy Policy
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
