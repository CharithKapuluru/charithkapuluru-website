const FIGURES = [
  { value: "3", label: "client migrations led from on-prem monoliths to AWS microservices, cutting hosting costs 35%" },
  { value: "~70%", label: "lower compute cost on ECS with Fargate Spot and autoscaling" },
  { value: "30%", label: "faster API responses after query and data-layer optimization" },
  { value: "1st", label: "place, UNT Cybersecurity Hackathon 2024" },
];

export default function ProofStrip() {
  return (
    <section aria-label="Highlights" className="border-y border-border bg-surface">
      <dl className="mx-auto grid max-w-6xl divide-y divide-border px-4 sm:px-6 md:grid-cols-4 md:divide-x md:divide-y-0">
        {FIGURES.map((f) => (
          <div key={f.value} className="py-6 md:px-6 md:first:pl-0 md:last:pr-0">
            <dt className="font-display text-figure tabular text-fg">{f.value}</dt>
            <dd className="mt-2 max-w-[28ch] text-small text-fg-2">{f.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
