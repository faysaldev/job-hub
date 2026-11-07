const steps = [
  { number: "01", title: "Search", description: "Browse available listings, and narrow the results to your preferences." },
  { number: "02", title: "Review", description: "Read the role, salary information, location and requirements before applying." },
  { number: "03", title: "Apply and follow up", description: "Submit your application and track its status from your workspace." },
];
export default function StepsSection() { return <section className="jh-container py-16 md:py-20"><div className="mb-9"><p className="jh-kicker mb-3">How it works</p><h2 className="text-3xl font-semibold tracking-tight text-[#162839] md:text-4xl">Three steps to your next role</h2></div>
  <div className="grid gap-4 md:grid-cols-3">{steps.map(step => <div key={step.number} className="jh-panel p-7"><span className="text-sm font-bold text-[#7895ad]">{step.number}</span><h3 className="mt-7 text-lg font-semibold text-[#162839]">{step.title}</h3><p className="mt-3 text-sm leading-6 text-[#66798a]">{step.description}</p></div>)}</div>
</section>; }
