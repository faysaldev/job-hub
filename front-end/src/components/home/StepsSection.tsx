const steps = [
  {
    number: "01",
    title: "Filter & Discover",
    description: "Search across verified job openings using multi-keyword tags, location filters, and seniority tiers.",
  },
  {
    number: "02",
    title: "Review Compensation",
    description: "Inspect transparent salary details, benefits, and team structures before submitting your profile.",
  },
  {
    number: "03",
    title: "Apply & Track Status",
    description: "Submit applications with one click and track interview invitations directly inside your workspace.",
  },
];

export default function StepsSection() {
  return (
    <section className="jh-container py-16 md:py-20">
      <div className="mb-10">
        <p className="jh-kicker mb-2">How It Works</p>
        <h2 className="text-2xl font-bold tracking-tight text-[#111827] md:text-3xl">
          Three Simple Steps To Your Next Role
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {steps.map((step) => (
          <div key={step.number} className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <span className="inline-block rounded-md bg-[#dcfce7] px-2.5 py-1 text-xs font-bold text-[#15803d]">
              Step {step.number}
            </span>
            <h3 className="mt-5 text-sm font-bold text-[#111827]">{step.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#596d7e]">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
