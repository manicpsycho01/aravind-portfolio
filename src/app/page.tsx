import { person } from "@/content/site";
import { Capabilities } from "@/components/Capabilities";
import { ContactBand } from "@/components/ContactBand";
import { DeparturesBoard } from "@/components/DeparturesBoard";
import { DotGridCanvas } from "@/components/DotGridCanvas";
import { Gates } from "@/components/Gates";
import { HeroName } from "@/components/HeroName";
import { Manifesto } from "@/components/Manifesto";
import { Reveals } from "@/components/Reveals";
import { SplitFlap } from "@/components/SplitFlap";

export default function Home() {
  return (
    <>
      <section aria-label="Introduction" className="gutter relative flex flex-col overflow-hidden pt-28 pb-4 md:min-h-[100svh]">
        <DotGridCanvas className="absolute inset-0 size-full" />

        <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between roomy:static">
          <div className="flex flex-col gap-3">
            <p className="label">Now boarding →</p>
            <SplitFlap
              words={person.roles}
              label={`Now boarding: ${person.roles.join(", ")}`}
              className="w-full md:w-[min(60vw,760px)] lg:w-[min(48vw,760px)]"
            />
          </div>
          {/* Its last line sits on SRINIVASAN's baseline: hero bottom → name line box (~86px + 7px text descent) + 0.1em of the name. */}
          <p className="max-w-[34ch] text-base leading-snug text-muted md:text-lg lg:max-w-[30ch] lg:text-right roomy:absolute roomy:right-[var(--gutter)] roomy:bottom-[calc(86px+(100svh-370px)/16.5)] roomy:z-10">
            {person.intro}
          </p>
        </div>

        <div className="relative mt-4 pt-8 md:mt-auto [container-type:inline-size]">
          <HeroName lines={[person.first, person.last]} className="display text-[calc(100cqw/4.02)] leading-[0.8] whitespace-nowrap md:text-[min(calc(100cqw/4.02),max(4.5rem,calc((100svh-370px)/1.65)))]" />
        </div>

        <div className="label relative mt-5 flex items-center justify-between border-t border-line pt-3 text-muted">
          <span>
            [ 2026 ] <span className="hidden sm:inline">— @{person.handle}</span>
          </span>
          <span className="hidden md:inline">{person.role}</span>
          <a href="#about" className="flex min-h-11 items-center gap-2 text-ink">
            Scroll
            <span className="relative block h-5 w-px overflow-hidden bg-line" aria-hidden>
              <span className="cue-line absolute inset-0 bg-ink" />
            </span>
          </a>
        </div>
      </section>

      <section id="about" aria-labelledby="about-title" className="gutter grid gap-10 py-28 md:grid-cols-12 md:py-44">
        <div className="label flex justify-between text-muted md:col-span-3 md:flex-col md:justify-start md:gap-2">
          <h2 id="about-title">(01) Manifesto</h2>
          <span>{person.role}</span>
        </div>
        <div className="md:col-span-9">
          <Manifesto text={person.manifesto} highlight="earn trust" />
        </div>
      </section>

      <DeparturesBoard />
      <Gates />
      <Capabilities />
      <ContactBand />
      <Reveals />
    </>
  );
}
