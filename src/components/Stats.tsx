import { projects } from "@/content/site";
import { CountUp } from "./CountUp";
import { SectionHead } from "./SectionHead";

/** [project slug, result value] pairs shown in the numbers row. */
const PICKS: [string, string][] = [
  ["tagmycredit", "271"],
  ["crew-ops-advisor", "36/36"],
  ["crew-ops-advisor", "119/119"],
  ["tagmycredit", "3"],
];

const stats = PICKS.map(([slug, value]) => {
  const project = projects.find((p) => p.slug === slug)!;
  return { project, result: project.results.find((r) => r.value === value)! };
});

export function Stats() {
  return (
    <section aria-labelledby="numbers-title" className="gutter py-24 md:py-36">
      <SectionHead index="04" label="Flight data" title="Numbers" id="numbers-title" />
      <dl className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
        {stats.map(({ project, result }) => (
          <div key={`${project.slug}-${result.value}`} data-reveal className="flex flex-col gap-4 border-t border-ink pt-4">
            <dt className="label flex justify-between text-muted">
              <span>Flt {project.no}</span>
              <span>{project.title}</span>
            </dt>
            <dd className="flex flex-col gap-3">
              <CountUp value={result.value} className="display text-[clamp(4.5rem,22vw,9rem)] leading-[0.8] sm:text-[11vw] lg:text-[7.4vw]" />
              <span className="max-w-[16rem] text-sm leading-snug text-muted">{result.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
