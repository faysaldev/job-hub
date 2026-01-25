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
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    jobSeekers: [
      { href: "/job", label: "Browse Jobs" },
      { href: "/job/saved", label: "Saved Jobs" },
      { href: "/job-seeker", label: "Dashboard" },
      { href: "/notifications", label: "Job Alerts" },
    ],
    employers: [
      { href: "/auth", label: "Post a Job" },
      { href: "/recruiter", label: "Recruiter Dashboard" },
      { href: "/auth", label: "Browse Candidates" },
      { href: "/contact", label: "Pricing" },
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
    <footer className="bg-gradient-to-b from-[#E3E3E3] to-white border-t border-[#234C6A]/10">
      {/* Newsletter Section */}
      <div className="border-b border-[#234C6A]/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-[#234C6A] mb-3">
              Stay Updated with Latest Jobs
            </h3>
            <p className="text-[#456882] mb-6">
              Subscribe to our newsletter and never miss new opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-12 bg-white border-[#234C6A]/20 focus:border-[#234C6A] rounded-xl"
              />
              <Button className="h-12 px-6 bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white rounded-xl">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-xl p-2">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-[#234C6A] to-[#456882] bg-clip-text text-transparent">
                JobHub
              </span>
            </Link>
            <p className="text-[#456882] leading-relaxed max-w-sm">
              Connecting talented professionals with their dream careers. Join
              millions of users who trust JobHub for their job search.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:support@jobhub.com"
                className="flex items-center gap-3 text-[#456882] hover:text-[#234C6A] transition-colors"
              >
                <Mail className="h-5 w-5" />
                support@jobhub.com
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 text-[#456882] hover:text-[#234C6A] transition-colors"
              >
                <Phone className="h-5 w-5" />
                +1 (234) 567-890
              </a>
              <div className="flex items-center gap-3 text-[#456882]">
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
                  className="w-10 h-10 rounded-xl bg-[#234C6A]/10 flex items-center justify-center text-[#234C6A] hover:bg-gradient-to-br hover:from-[#234C6A] hover:to-[#456882] hover:text-white transition-all"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Job Seekers */}
          <div>
            <h3 className="font-bold text-[#234C6A] mb-4">For Job Seekers</h3>
            <ul className="space-y-3">
              {footerLinks.jobSeekers.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-[#456882] hover:text-[#234C6A] transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h3 className="font-bold text-[#234C6A] mb-4">For Employers</h3>
            <ul className="space-y-3">
              {footerLinks.employers.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-[#456882] hover:text-[#234C6A] transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-[#234C6A] mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-[#456882] hover:text-[#234C6A] transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
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
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#456882]">
              &copy; {currentYear} JobHub. All rights reserved.
            </p>
            <p className="text-sm text-[#456882] flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by JobHub Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
