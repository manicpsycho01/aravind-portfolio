import Link from "next/link";
import { projects } from "@/content/site";
import { SectionHead } from "./SectionHead";
import { StatusChip } from "./StatusChip";

const COLS = "lg:grid lg:grid-cols-[5rem_minmax(0,1fr)_11rem_4.5rem_11rem] xl:grid-cols-[8rem_minmax(0,1fr)_15rem_6rem_12rem] lg:items-center lg:gap-6";

/** Selected work as a departures board; rows become boarding-pass cards below 1024px (two per row on tablets). */
export function DeparturesBoard() {
  return (
    <section aria-labelledby="work-title" id="work" className="gutter scroll-mt-4 bg-ink py-24 text-paper md:py-36">
      <SectionHead index="02" label="Selected work" title="Departures" id="work-title" tone="paper" />

      <div className={`label mt-14 hidden border-b border-paper-line pb-3 text-paper-muted lg:mt-20 ${COLS}`} aria-hidden>
        <span>Flt</span>
        <span>Destination</span>
        <span>Type</span>
        <span>Year</span>
        <span>Status</span>
      </div>

        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-0 lg:flex lg:flex-col lg:gap-0">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <Link
                href={`/work/${p.slug}`}
                data-row={i}
                data-cursor="VIEW"
                className={`group relative block rounded-xl bg-graphite p-5 transition-colors duration-500 lg:rounded-none lg:border-b lg:border-paper-line lg:bg-transparent lg:px-0 lg:py-7 lg:hover:bg-graphite ${COLS}`}
              >
                <span className="flex items-center justify-between">
                  <span className="label text-paper-muted transition-transform duration-500 ease-out-expo lg:group-hover:translate-x-3">
                    Flt {p.no}
                  </span>
                  <span className="lg:hidden">
                    <StatusChip status={p.status} />
                  </span>
                </span>

                <span className="display mt-8 block text-[clamp(3rem,15vw,4.5rem)] transition-transform duration-500 ease-out-expo lg:mt-0 lg:text-[clamp(2.75rem,4.6vw,5rem)] lg:group-hover:translate-x-5">
                  {p.title}
                  <span className="block font-sans text-sm font-normal tracking-normal normal-case text-paper-muted lg:hidden">{p.kicker}</span>
                </span>

                <span className="perf relative -mx-5 my-6 block border-t border-dashed border-paper-line lg:hidden" aria-hidden />

                <dl className="grid grid-cols-2 gap-4 lg:contents">
                  <div>
                    <dt className="label text-paper-muted lg:sr-only">Type</dt>
                    <dd className="label mt-1 lg:mt-0">{p.type}</dd>
                  </div>
                  <div>
                    <dt className="label text-paper-muted lg:sr-only">Year</dt>
                    <dd className="label mt-1 tabular-nums lg:mt-0">{p.year}</dd>
                  </div>
                  <div className="hidden lg:block">
                    <dt className="sr-only">Status</dt>
                    <dd>
                      <StatusChip status={p.status} />
                    </dd>
                  </div>
                </dl>
              </Link>
            </li>
          ))}
        </ol>
    </section>
  );
}
