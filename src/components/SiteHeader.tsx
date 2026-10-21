import Link from "next/link";
import { person } from "@/content/site";
import { LocalTime } from "./LocalTime";

export function SiteHeader() {
  return (
    <header className="gutter absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div className="label flex items-start gap-3 md:gap-6">
        <Link href="/" aria-label={`${person.name}, home`} className="display -mt-1 text-[2.1rem] leading-none tracking-normal">
          AS<span className="text-signal">.</span>
        </Link>
        <p className="flex flex-col text-muted">
          <span>{person.location} —</span>
          <LocalTime zone={person.timezone} />
        </p>
      </div>

      <nav aria-label="Primary" className="label hidden gap-8 md:flex">
        <Link href="/#work" className="link-u">
          (01) Work
        </Link>
        <Link href="/#contact" className="link-u">
          (02) Contact
        </Link>
      </nav>

      <p className="label flex min-h-11 items-center gap-2 rounded-full border border-line bg-paper/70 px-3.5 backdrop-blur-sm">
        <span className="pulse-dot size-2 shrink-0 rounded-full bg-signal" aria-hidden />
        {person.available}
      </p>
    </header>
  );
}
