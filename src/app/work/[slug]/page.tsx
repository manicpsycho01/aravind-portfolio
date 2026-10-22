import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/site";
import { CaseKeys } from "@/components/CaseKeys";
import { Gallery } from "@/components/Gallery";
import { NextFlight } from "@/components/NextFlight";
import { Reveals } from "@/components/Reveals";
import { StatusChip } from "@/components/StatusChip";

type Props = { params: Promise<{ slug: string }> };

const find = (slug: string) => projects.findIndex((p) => p.slug === slug);

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = projects[find((await params).slug)];
  if (!project) return {};
  return { title: project.title, description: project.summary, openGraph: { title: project.title, description: project.summary } };
}

function Block({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-label={title} className="gutter grid gap-8 py-16 md:grid-cols-12 md:py-24">
      <h2 className="label flex justify-between border-t border-line pt-4 text-muted md:col-span-3 md:flex-col md:justify-start md:gap-2">
        <span>({index})</span>
        <span>{title}</span>
      </h2>
      <div className="md:col-span-9 md:border-t md:border-line md:pt-4">{children}</div>
    </section>
  );
}

export default async function CaseStudy({ params }: Props) {
  const index = find((await params).slug);
  if (index < 0) notFound();
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const meta: [string, React.ReactNode][] = [
    ["Role", p.role],
    ["Year", p.year],
    ["Type", p.type],
    ["Status", <StatusChip key="s" status={p.status} />],
  ];

  return (
    <article>
      <header className="gutter pt-36 md:pt-44">
        <p className="label flex justify-between border-t border-line pt-4 text-muted">
          <Link href="/#work" className="link-u inline-flex min-h-11 items-center self-start">
            ← All departures
          </Link>
          <span className="pt-3.5">Flt {p.no} / [ {p.year} ]</span>
        </p>
        <h1 data-reveal className="display mt-8 text-[clamp(3.5rem,12.5vw,14.5rem)] break-words md:mt-12">
          {p.title}
        </h1>
        <p data-reveal data-delay="0.1" className="mt-6 max-w-3xl text-xl leading-snug md:mt-10 md:text-3xl md:tracking-[-0.02em]">
          {p.kicker}
        </p>

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-6 md:mt-16 md:grid-cols-6">
          {meta.map(([label, value]) => (
            <div key={label} className={label === "Role" ? "col-span-2" : ""}>
              <dt className="label text-muted">{label}</dt>
              <dd className="mt-2 text-sm leading-snug">{value}</dd>
            </div>
          ))}
          <div>
            <dt className="label text-muted">Links</dt>
            <dd className="mt-1 flex flex-col">
              {p.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="link-u inline-flex min-h-11 items-center self-start text-sm">
                  {l.label} ↗
                </a>
              ))}
            </dd>
          </div>
        </dl>
      </header>

      <section aria-label="Gallery" className="gutter mt-12 md:mt-20">
        <div data-reveal="wipe">
          <Gallery shots={[p.cover, ...p.gallery]} tint={p.tint} title={p.title} />
        </div>
      </section>

      <section aria-label="Summary" className="gutter py-20 md:py-32">
        <p data-reveal className="max-w-5xl text-[clamp(1.6rem,3.6vw,3.5rem)] leading-[1.08] font-medium tracking-[-0.03em]">
          {p.summary}
        </p>
      </section>

      <Block index="01" title="Problem">
        <p className="max-w-3xl text-xl leading-snug md:text-2xl">{p.problem}</p>
      </Block>

      <Block index="02" title="Approach">
        <ol className="grid gap-x-10 gap-y-10 md:grid-cols-2">
          {p.approach.map((step, i) => (
            <li key={step} data-reveal className="flex flex-col gap-3">
              <span className="display text-outline text-6xl md:text-7xl">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-base leading-relaxed md:text-lg">{step}</span>
            </li>
          ))}
        </ol>
      </Block>

      <Block index="03" title="What I built">
        <ul className="flex flex-col">
          {p.built.map((item) => (
            <li key={item} data-reveal className="border-b border-line py-5 text-base leading-relaxed first:pt-0 md:text-lg">
              {item}
            </li>
          ))}
        </ul>
      </Block>

      <section aria-label="Results" className="bg-ink py-20 text-paper md:py-28">
        <div className="gutter">
          <h2 className="label flex justify-between border-t border-paper-line pt-4 text-paper-muted">
            <span>(04)</span>
            <span>Results</span>
          </h2>
          <dl className={`mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 ${p.results.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            {p.results.map((r) => (
              <div key={r.label} data-reveal className="flex flex-col-reverse gap-3 border-t border-paper-line pt-4">
                <dt className="max-w-[18rem] text-sm leading-snug text-paper-muted">{r.label}</dt>
                <dd className="display text-[clamp(3.5rem,7vw,7.5rem)] leading-[0.85]">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Block index="05" title="Stack">
        <ul className="flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <li key={s} className="label rounded-full border border-ink/25 px-4 py-2.5">
              {s}
            </li>
          ))}
        </ul>
      </Block>

      <NextFlight project={next} />
      <CaseKeys prev={`/work/${prev.slug}`} next={`/work/${next.slug}`} />
      <Reveals />
    </article>
  );
}
