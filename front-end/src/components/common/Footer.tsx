"use client";

import {
  Briefcase,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Heart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    jobSeekers: [
      { href: "/job", label: "Browse Jobs" },
      { href: "/job/saved", label: "Saved Jobs" },
      { href: "/job-seeker", label: "Dashboard" },
    ],
    employers: [
      { href: "/recruiter/create-job", label: "Post a Job" },
      { href: "/recruiter", label: "Recruiter Dashboard" },
      { href: "/candidates", label: "Browse Candidates" },
    ],
    company: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-service", label: "Terms of Service" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer className="border-t border-[#234C6A]/10 bg-white">
      <div className="bg-[#234C6A] text-white">
        <div className="container mx-auto grid gap-5 px-4 py-7 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-white/80">
              <Sparkles className="h-3.5 w-3.5" />
              JobHub Marketplace
            </div>
            <h2 className="text-2xl font-black tracking-tight md:text-3xl">
              Better hiring and better careers, in one place.
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-6 font-black text-[#234C6A] transition-colors hover:bg-[#E3E3E3]"
          >
            Contact Support
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold text-xl group z-10"
            >
              <Image
                width={100}
                height={100}
                src={"/job-hub-logo-removebg-preview.png"}
                alt="Logo"
                priority
                className="h-auto max-h-14 w-[150px] object-contain md:w-[175px]"
              />
            </Link>
            <p className="max-w-sm text-sm font-medium leading-7 text-[#456882]">
              Connecting talented professionals with their dream careers. Join
              millions of users who trust JobHub for their job search.
            </p>

            {/* Contact Info */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <a
                href="mailto:support@jobhub.com"
                className="flex items-center gap-3 rounded-2xl bg-[#F8FAFC] p-3 text-sm font-bold text-[#456882] transition-colors hover:text-[#234C6A]"
              >
                <Mail className="h-5 w-5" />
                support@jobhub.com
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 rounded-2xl bg-[#F8FAFC] p-3 text-sm font-bold text-[#456882] transition-colors hover:text-[#234C6A]"
              >
                <Phone className="h-5 w-5" />
                +1 (234) 567-890
              </a>
              <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAFC] p-3 text-sm font-bold text-[#456882] sm:col-span-2 lg:col-span-1">
                <MapPin className="h-5 w-5" />
                San Francisco, CA
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#234C6A]/10 text-[#234C6A] transition-all hover:bg-gradient-to-br hover:from-[#234C6A] hover:to-[#456882] hover:text-white"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Job Seekers */}
          <div>
            <h3 className="mb-4 font-black text-[#234C6A]">For Job Seekers</h3>
            <ul className="space-y-3">
              {footerLinks.jobSeekers.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm font-bold text-[#456882] transition-colors hover:text-[#234C6A]"
                  >
                    <ArrowRight className="-ml-5 h-3 w-3 opacity-0 transition-all group-hover:ml-0 group-hover:opacity-100" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h3 className="mb-4 font-black text-[#234C6A]">For Employers</h3>
            <ul className="space-y-3">
              {footerLinks.employers.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm font-bold text-[#456882] transition-colors hover:text-[#234C6A]"
                  >
                    <ArrowRight className="-ml-5 h-3 w-3 opacity-0 transition-all group-hover:ml-0 group-hover:opacity-100" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 font-black text-[#234C6A]">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm font-bold text-[#456882] transition-colors hover:text-[#234C6A]"
                  >
                    <ArrowRight className="-ml-5 h-3 w-3 opacity-0 transition-all group-hover:ml-0 group-hover:opacity-100" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#234C6A]/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm font-medium text-[#456882]">
              &copy; {currentYear} JobHub. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-[#456882]">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-[#234C6A]" />
                Secure marketplace
              </span>
              <span className="inline-flex items-center gap-1">
                Made with{" "}
                <Heart className="h-4 w-4 fill-red-500 text-red-500" /> by
                JobHub Team
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
