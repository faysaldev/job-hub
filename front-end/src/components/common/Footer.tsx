import {
  Briefcase,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-[#456882]/30 bg-[#E3E3E3]">
      <div className="container py-12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg"
            >
              <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-lg p-1.5">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-[#234C6A] to-[#456882] bg-clip-text text-transparent">
                JobHubs
              </span>
            </Link>
            <p className="text-sm text-[#234C6A]">
              Connecting talented professionals with their dream careers.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="text-[#234C6A] hover:text-[#456882] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-[#234C6A] hover:text-[#456882] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-[#234C6A] hover:text-[#456882] transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-[#234C6A] hover:text-[#456882] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Job Seekers */}
          <div>
            <h3 className="font-semibold mb-4 text-[#234C6A]">
              For Job Seekers
            </h3>
            <ul className="space-y-2 text-sm text-[#234C6A]">
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-[#456882] transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-[#456882] transition-colors"
                >
                  Job Alerts
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-[#456882] transition-colors"
                >
                  Career Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-[#456882] transition-colors"
                >
                  Resume Builder
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h3 className="font-semibold mb-4 text-[#234C6A]">For Employers</h3>
            <ul className="space-y-2 text-sm text-[#234C6A]">
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-[#456882] transition-colors"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-[#456882] transition-colors"
                >
                  Browse Candidates
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-[#456882] transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-[#456882] transition-colors"
                >
                  Employer Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-[#234C6A]">Company</h3>
            <ul className="space-y-2 text-sm text-[#234C6A]">
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-[#456882] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#456882] transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-[#456882] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="hover:text-[#456882] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#456882]/30 text-center text-sm text-[#234C6A]">
          <p>&copy; 2025 JobHubs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
