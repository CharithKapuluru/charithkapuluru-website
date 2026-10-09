import Avatar from "@/components/brand/Avatar";
import Tag from "@/components/ui/Tag";

const TIMELINE = [
  { when: "2024 to 2026", what: "MS Computer Science, University of North Texas" },
  { when: "2022 to 2024", what: "Software Engineer, KANsolv Technologies, Hyderabad" },
  { when: "2021 to 2022", what: "Software Engineering Intern, KANsolv Technologies" },
];

const AWARDS = "Star Performer (Q2 2023) and Code Quality Champion (Q4 2023) at KANsolv. First place, UNT Cybersecurity Hackathon 2024.";

const STACK = [
  { group: "Cloud", items: ["AWS ECS", "ECR", "Lambda", "ALB", "VPC", "S3", "CloudWatch", "IAM"] },
  { group: "IaC and CI/CD", items: ["Terraform", "CloudFormation", "GitHub Actions", "CodePipeline", "Jenkins"] },
  { group: "Containers", items: ["Docker", "Kubernetes"] },
  { group: "Observability", items: ["Splunk", "Datadog", "Dynatrace", "Grafana", "PagerDuty"] },
  { group: "Languages", items: ["Python", "Java", "TypeScript", "Bash", "HCL", "SQL"] },
];

export default function AboutSection() {
  return (
    <section id="about" className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-12 md:py-28">
      <div className="md:col-span-5">
        <div className="relative mx-auto max-w-[360px]">
          <img src="/world/charith-photo.webp" alt="Charith Kapuluru" width={800} height={1000} loading="lazy" decoding="async" className="aspect-[4/5] w-full rounded-xl object-cover" />
          <div className="absolute -bottom-4 -right-6 hidden sm:block" aria-hidden>
            <Avatar pose="peek" width={110} pokeable={false} />
          </div>
        </div>
      </div>
      <div className="md:col-span-7">
        <h2 className="text-h2 text-fg">About</h2>
        <div className="mt-5 space-y-4 text-body-read text-fg-2">
          <p>
            I&apos;m a software engineer finishing my Master&apos;s in Computer Science at the University of North Texas. Before UNT I spent three years at KANsolv
            Technologies in Hyderabad, breaking monoliths into containerized microservices on AWS and building the CI/CD, auth and observability around them.
          </p>
          <p>I care about infrastructure that stays boring in production, and about explaining it clearly. The guides on this site started as the notes I wished I had when I began.</p>
        </div>
        <ol className="mt-8 divide-y divide-border border-y border-border">
          {TIMELINE.map((t) => (
            <li key={t.when} className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr]">
              <span className="text-caption text-fg-3 tabular">{t.when}</span>
              <span className="text-small text-fg">{t.what}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-small text-fg-2">{AWARDS}</p>
        <div className="mt-8 space-y-4">
          {STACK.map((s) => (
            <div key={s.group}>
              <p className="text-caption font-medium text-fg-3">{s.group}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {s.items.map((i) => (
                  <Tag key={i}>{i}</Tag>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 flex gap-5 text-small font-medium">
          <a href="https://github.com/CharithKapuluru" target="_blank" rel="noopener noreferrer" className="text-fg-2 hover:text-fg">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/charith-kapuluru-159456329/" target="_blank" rel="noopener noreferrer" className="text-fg-2 hover:text-fg">
            LinkedIn
          </a>
        </p>
      </div>
    </section>
  );
}
