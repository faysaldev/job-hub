"use client";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#E3E3E3] py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-[#234C6A]/10 rounded-full mb-4">
            <Shield className="h-10 w-10 text-[#234C6A]" />
          </div>
          <h1 className="text-4xl font-bold text-[#234C6A] mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-[#234C6A]/80">
            Last updated: November 28, 2025
          </p>
        </div>

        <Card className="p-8 mb-8 border-[#456882]/30 bg-white">
          <p className="text-[#234C6A]/80 mb-6">
            At JobHub, we are committed to protecting your privacy and personal
            information. This Privacy Policy explains how we collect, use, and
            safeguard your data when you use our services.
          </p>

          <h2 className="text-2xl font-bold text-[#234C6A] mb-4 mt-8">
            Information We Collect
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-6 text-[#234C6A]/80">
            <li>
              Personal identification information (name, email address, phone
              number)
            </li>
            <li>Professional information (resume, work experience, skills)</li>
            <li>
              Usage data (pages visited, time spent on site, browser type)
            </li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#234C6A] mb-4 mt-8">
            How We Use Your Information
          </h2>
          <p className="text-[#234C6A]/80 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6 text-[#234C6A]/80">
            <li>Provide and operate our services</li>
            <li>Personalize your experience on our platform</li>
            <li>Process job applications and recruitment activities</li>
            <li>Send you important service and administrative notifications</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#234C6A] mb-4 mt-8">
            Data Protection
          </h2>
          <p className="text-[#234C6A]/80 mb-6">
            We implement appropriate technical and organizational measures to
            ensure a level of security appropriate to the risk, including
            encryption, secure servers, and access controls to protect your
            personal information from unauthorized access, use, or disclosure.
          </p>

          <h2 className="text-2xl font-bold text-[#234C6A] mb-4 mt-8">
            Your Rights
          </h2>
          <p className="text-[#234C6A]/80 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 mb-6 text-[#234C6A]/80">
            <li>Access your personal data</li>
            <li>Rectify inaccurate personal data</li>
            <li>Request deletion of your personal data</li>
            <li>Restrict processing of your personal data</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#234C6A] mb-4 mt-8">
            Cookies
          </h2>
          <p className="text-[#234C6A]/80 mb-6">
            We use cookies and similar tracking technologies to enhance your
            experience on our platform, analyze site traffic, and personalize
            content. You can manage your cookie preferences in your browser
            settings.
          </p>

          <h2 className="text-2xl font-bold text-[#234C6A] mb-4 mt-8">
            Third-Party Services
          </h2>
          <p className="text-[#234C6A]/80 mb-6">
            We may use third-party services such as analytics providers, payment
            processors, and cloud hosting services. These services may have
            their own privacy policies, and we encourage you to review them.
          </p>

          <h2 className="text-2xl font-bold text-[#234C6A] mb-4 mt-8">
            Changes to This Policy
          </h2>
          <p className="text-[#234C6A]/80 mb-6">
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated revision date. Your
            continued use of our services after the changes take effect will
            constitute your acceptance of the revised policy.
          </p>

          <h2 className="text-2xl font-bold text-[#234C6A] mb-4 mt-8">
            Contact Us
          </h2>
          <p className="text-[#234C6A]/80 mb-6">
            If you have any questions about this Privacy Policy, please contact
            us at:
          </p>
          <p className="text-[#234C6A]/80 mb-8">
            Email: privacy@jobhub.com
            <br />
            Address: 123 Business Avenue, San Francisco, CA 94107
          </p>

          <div className="flex justify-center">
            <Button className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white">
              Return to Homepage
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
