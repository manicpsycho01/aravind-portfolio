import Link from "next/link";
import { projects } from "@/content/site";
import { SectionHead } from "./SectionHead";
import { StatusChip } from "./StatusChip";

const COLS = "md:grid md:grid-cols-[6rem_minmax(0,1fr)_12rem_5rem_11rem] lg:grid-cols-[8rem_minmax(0,1fr)_15rem_6rem_12rem] md:items-center md:gap-6";

/** Selected work as a departures board; rows become boarding-pass cards on mobile. */
export function DeparturesBoard() {
  return (
    <section aria-labelledby="work-title" id="work" className="gutter scroll-mt-4 bg-ink py-24 text-paper md:py-36">
      <SectionHead index="02" label="Selected work" title="Departures" id="work-title" tone="paper" />

      <div className={`label mt-14 hidden border-b border-paper-line pb-3 text-paper-muted md:mt-20 ${COLS}`} aria-hidden>
        <span>Flt</span>
        <span>Destination</span>
        <span>Type</span>
        <span>Year</span>
        <span>Status</span>
      </div>

        <ol className="mt-10 flex flex-col gap-4 md:mt-0 md:gap-0">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <Link
                href={`/work/${p.slug}`}
                data-row={i}
                data-cursor="VIEW"
                className={`group relative block rounded-xl bg-graphite p-5 transition-colors duration-500 md:rounded-none md:border-b md:border-paper-line md:bg-transparent md:px-0 md:py-7 md:hover:bg-graphite ${COLS}`}
              >
                <span className="flex items-center justify-between">
                  <span className="label text-paper-muted transition-transform duration-500 ease-out-expo md:group-hover:translate-x-3">
                    Flt {p.no}
                  </span>
                  <span className="md:hidden">
                    <StatusChip status={p.status} />
                  </span>
                </span>

                <span className="display mt-8 block text-[clamp(3rem,15vw,4.5rem)] transition-transform duration-500 ease-out-expo md:mt-0 md:text-[clamp(2.75rem,4.6vw,5rem)] md:group-hover:translate-x-5">
                  {p.title}
                  <span className="block font-sans text-sm font-normal tracking-normal normal-case text-paper-muted md:hidden">{p.kicker}</span>
                </span>

                <span className="perf relative -mx-5 my-6 block border-t border-dashed border-paper-line md:hidden" aria-hidden />

                <dl className="grid grid-cols-2 gap-4 md:contents">
                  <div>
                    <dt className="label text-paper-muted md:sr-only">Type</dt>
                    <dd className="label mt-1 md:mt-0">{p.type}</dd>
                  </div>
                  <div>
                    <dt className="label text-paper-muted md:sr-only">Year</dt>
                    <dd className="label mt-1 tabular-nums md:mt-0">{p.year}</dd>
                  </div>
                  <div className="hidden md:block">
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
