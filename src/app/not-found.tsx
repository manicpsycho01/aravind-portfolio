import Link from "next/link";
import { SplitFlap } from "@/components/SplitFlap";

export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="gutter flex min-h-[100svh] flex-col justify-center gap-10 pt-28 pb-16">
      <p className="label flex justify-between border-t border-line pt-4 text-muted">
        <span>Flt 404</span>
        <span>Status: cancelled</span>
      </p>
      <h1 id="nf-title" className="sr-only">
        Flight not found — return to gate
      </h1>
      <SplitFlap words={["Flight not found"]} className="w-full max-w-5xl" />
      <Link href="/" data-cursor="OPEN" className="display self-start text-[clamp(3rem,10vw,9rem)] transition-transform hover:translate-x-3">
        Return to gate <span className="text-signal">→</span>
      </Link>
    </section>
  );
}
