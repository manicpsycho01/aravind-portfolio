import { capabilities, stackMarquee } from "@/content/site";
import { Marquee } from "./Marquee";
import { SectionHead } from "./SectionHead";

export function Capabilities() {
  return (
    <section aria-labelledby="capabilities-title" className="pb-24 md:pb-36">
      <div className="gutter">
        <SectionHead index="05" label="Capabilities & stack" title="On board" id="capabilities-title" />
      </div>
      <div className="mt-14 flex flex-col border-y border-line md:mt-20">
        <Marquee
          items={capabilities}
          direction={-1}
          className="border-b border-line py-5 md:py-7"
          itemClassName="display text-[clamp(3rem,8vw,8.5rem)]"
          separator="✦"
        />
        <Marquee items={stackMarquee} direction={1} speed={0.03} className="py-4 md:py-5" itemClassName="label text-sm md:text-base text-muted" separator="·" />
      </div>
    </section>
  );
}
