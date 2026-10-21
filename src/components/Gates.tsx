import Link from "next/link";
import { projects } from "@/content/site";
import { DeviceFrame } from "./DeviceFrame";
import { GatesTrack } from "./GatesTrack";

/** One large panel per project. Pinned horizontal scroll on desktop, stacked cards elsewhere. */
export function Gates() {
  return (
    <GatesTrack className="relative overflow-hidden py-24 md:py-36 fx:flex fx:h-dvh fx:flex-col fx:py-0">
      <section aria-labelledby="gates-title" className="flex flex-1 flex-col">
        <div data-track className="gutter flex flex-col gap-16 fx:h-full fx:flex-row fx:items-stretch fx:gap-[6vw] fx:py-24">
          <div className="flex flex-col justify-between gap-6 border-t border-line pt-4 fx:w-[34vw] fx:shrink-0">
            <p className="label flex justify-between text-muted">
              <span>(03)</span>
              <span>Gates</span>
            </p>
            <h2 id="gates-title" className="display text-[clamp(3.5rem,13vw,13.5rem)] fx:text-[10vw]">
              Now at
              <br />
              the gate
            </h2>
            <p className="label hidden text-muted fx:block">Scroll →</p>
          </div>

          {projects.map((p, i) => (
            <article
              key={p.slug}
              data-panel
              className="relative grid gap-8 border-t border-line pt-4 fx:w-[80vw] fx:shrink-0 fx:grid-cols-12 fx:items-end fx:gap-10"
            >
              <div className="relative flex flex-col gap-5 fx:col-span-4 fx:self-stretch fx:justify-between">
                <p className="label flex justify-between text-muted">
                  <span>Gate {p.no}</span>
                  <span>[ {p.year} ]</span>
                </p>
                <span aria-hidden data-parallax="15" className="display text-outline block text-[34vw] leading-[0.75] fx:text-[13vw]">
                  {p.no}
                </span>
                <div className="flex flex-col gap-5">
                  <p className="label text-muted">{p.kicker}</p>
                  <h3 className="display text-[clamp(3rem,12vw,6.5rem)] fx:text-[5.2vw]">{p.title}</h3>
                  <p className="max-w-md text-base leading-relaxed text-muted">{p.summary}</p>
                  <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
                    {p.stack.slice(0, 5).map((s) => (
                      <li key={s} className="label rounded-full border border-line px-2.5 py-1">
                        {s}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/work/${p.slug}`} data-cursor="OPEN" className="label link-u mt-2 inline-flex min-h-11 items-center self-start">
                    Board flight {p.no} →
                  </Link>
                </div>
              </div>

              <Link
                href={`/work/${p.slug}`}
                tabIndex={-1}
                aria-hidden
                data-cursor="OPEN"
                className={`group relative block overflow-hidden rounded-xl fx:col-span-8 ${p.cover.device === "none" ? "bg-graphite" : ""}`}
              >
                <div className={p.cover.device === "none" ? "mx-auto w-3/4 max-w-xl py-4" : ""}>
                  <DeviceFrame shot={p.cover} sizes="(min-width: 1024px) 55vw, 100vw" priority={i === 0} />
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </GatesTrack>
  );
}
