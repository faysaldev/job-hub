import React from "react";

const featuredCompanies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Apple",
  "Netflix",
];

export default function TrustedBySection() {
  return (
    <section className="border-y border-[#234C6A]/10 bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#456882]">
            Trusted by teams hiring across every discipline
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {featuredCompanies.map((company) => (
              <span
                key={company}
                className="text-lg font-black text-[#234C6A]/35 transition hover:text-[#234C6A]"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
