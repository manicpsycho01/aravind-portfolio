import { person } from "@/content/site";
import { CopyEmail } from "./CopyEmail";
import { Magnetic } from "./Magnetic";

export function ContactBand() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="on-signal gutter scroll-mt-0 bg-signal pt-6 pb-10 text-ink md:pb-14">
      <p className="label flex justify-between border-t border-ink/25 pt-4">
        <span>(06) Contact</span>
        <span>{person.available}</span>
      </p>

      <h2 id="contact-title" data-reveal className="display mt-16 text-[19.5vw] leading-[0.8] whitespace-nowrap md:mt-24">
        Let&rsquo;s build <span aria-hidden>→</span>
      </h2>

      <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-12 md:items-end">
        <p className="max-w-md text-lg leading-snug md:col-span-5 md:text-xl">{person.intro}</p>
        <div className="flex flex-col items-start gap-5 md:col-span-7 md:items-end">
          <Magnetic>
            <CopyEmail
              email={person.email}
              className="flex min-h-14 max-w-full items-center gap-5 rounded-full bg-ink px-6 py-4 text-left text-base text-paper transition-transform hover:scale-[1.02] md:px-8 md:text-2xl"
            />
          </Magnetic>
          <div className="label flex gap-6">
            <a href={`mailto:${person.email}`} className="link-u inline-flex min-h-11 items-center">
              Write an email ↗
            </a>
            <a href={person.github} target="_blank" rel="noreferrer" className="link-u inline-flex min-h-11 items-center">
              GitHub ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
