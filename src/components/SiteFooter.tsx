import { person } from "@/content/site";
import { LocalTime } from "./LocalTime";

export function SiteFooter() {
  return (
    <footer className="gutter label grid grid-cols-2 items-center gap-y-1 bg-ink pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-paper-muted md:grid-cols-4">
      <span>© {new Date().getFullYear()} {person.name}</span>
      <span>
        {person.location} · <LocalTime zone={person.timezone} />
      </span>
      <a href={person.github} target="_blank" rel="noreferrer" className="link-u inline-flex min-h-11 items-center justify-self-start text-paper md:justify-self-center">
        GitHub ↗
      </a>
      <a href="#main" className="link-u inline-flex min-h-11 items-center justify-self-start text-paper md:justify-self-end">
        Back to top ↑
      </a>
    </footer>
  );
}
