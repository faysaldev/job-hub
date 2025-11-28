"use client";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { FileText } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#E3E3E3] py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-[#234C6A]/10 rounded-full mb-4">
            <FileText className="h-10 w-10 text-[#234C6A]" />
          </div>
          <h1 className="text-4xl font-bold text-[#234C6A] mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-[#234C6A]/80">
            Last updated: November 28, 2025
          </p>
        </div>

        <Card className="p-8 mb-8 border-[#456882]/30 bg-white">
          <p className="text-[#234C6A]/80 mb-6">
            These Terms of Service ("Terms") govern your access to and use of
            the JobHub platform, including our website, applications, and
            services (collectively, "Services"), operated by JobHub, Inc.
          </p>

          <h2 className="text-2xl font-bold text-[#234C6A] mb-4 mt-8">
            Acceptance of Terms
          </h2>
          <p className="text-[#234C6A]/80 mb-6">
            By accessing or using our Services, you agree to be bound by these
            Terms. If you disagree with any part of these Terms, you may not
            access our Services. These Terms apply to all visitors, users, and
            others who access or use our Services.
          </p>

          <h2 className="text-2xl font-bold text-[#234C6A] mb-4 mt-8">
            Use License
          </h2>
          <p className="text-[#234C6A]/80 mb-4">
            Subject to these Terms, JobHub grants you a limited, non-exclusive,
            non-transferable, revocable license to use our Services for your
            personal or internal business purposes.
          </p>
          <p className="text-[#234C6A]/80 mb-6">
            This license does not include any resale or commercial use of our
            Services or any derivative use of our content.
          </p>

          <h2 className="text-2xl font-bold text-[#234C6A] mb-4 mt-8">
            User Accounts
          </h2>
          <p className="text-[#234C6A]/80 mb-4">
            When you create an account with us, you must provide accurate and
            complete information. You are responsible for maintaining the
            security of your account and for all activities that occur under
            your account.
          </p>
          <p className="text-[#234C6A]/80 mb-6">
            You agree to notify us immediately of any unauthorized use of your
            account or any other breach of security.
          </p>

          <h2 className="text-2xl font-bold text-[#234C6A] mb-4 mt-8">
            Prohibited Uses
          </h2>
          <p className="text-[#234C6A]/80 mb-4">
            You may not access or use our Services for any purpose that is
            unlawful or prohibited by these Terms. You may not use our Services:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6 text-[#234C6A]/80">
            <li>
              In any way that violates any applicable national or international
              law or regulation
            </li>
            <li>
              To transmit, or procure the sending of, any promotional or
              advertising materials
            </li>
            <li>
              To impersonate or attempt to impersonate JobHub, a JobHub
              employee, or any other person
            </li>
            <li>
              In any way that is likely to damage, disable, overburden, or
              impair any JobHub server
            </li>
            <li>
              To engage in any other conduct that restricts or inhibits anyone's
              use of our Services
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[#234C6A] mb-4 mt-8">
            Content
          </h2>
          <p className="text-[#234C6A]/80 mb-4">
            Our Services may contain content provided by users, companies, or
            other third parties. All content is the sole responsibility of the
            entity that created it.
          </p>
          <p className="text-[#234C6A]/80 mb-6">
            JobHub does not control and is not responsible for any content,
            including its accuracy, completeness, or reliability.
          </p>

          <h2 className="text-2xl font-bold text-[#234C6A] mb-4 mt-8">
            Limitation of Liability
          </h2>
          <p className="text-[#234C6A]/80 mb-6">
            In no event shall JobHub, nor its directors, employees, partners,
            agents, suppliers, or affiliates, be liable for any indirect,
            incidental, special, consequential, or punitive damages, including
            without limitation, loss of profits, data, use, goodwill, or other
            intangible losses, resulting from your access to or use of or
            inability to access or use our Services.
          </p>

          <h2 className="text-2xl font-bold text-[#234C6A] mb-4 mt-8">
            Governing Law
          </h2>
          <p className="text-[#234C6A]/80 mb-6">
            These Terms shall be governed and construed in accordance with the
            laws of California, United States, without regard to its conflict of
            law provisions.
          </p>
          <p className="text-[#234C6A]/80 mb-6">
            Our failure to enforce any right or provision of these Terms will
            not be considered a waiver of those rights. If any provision of
            these Terms is held to be invalid or unenforceable by a court, the
            remaining provisions of these Terms will remain in effect.
          </p>

          <h2 className="text-2xl font-bold text-[#234C6A] mb-4 mt-8">
            Changes to Terms
          </h2>
          <p className="text-[#234C6A]/80 mb-6">
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. If a revision is material, we will provide
            at least 30 days' notice prior to any new terms taking effect.
          </p>
          <p className="text-[#234C6A]/80 mb-8">
            What constitutes a material change will be determined at our sole
            discretion.
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
