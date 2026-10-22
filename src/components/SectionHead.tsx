/** Numbered section heading: mono index + giant condensed title. */
export function SectionHead({ index, label, title, id, tone = "ink" }: { index: string; label: string; title: string; id?: string; tone?: "ink" | "paper" }) {
  return (
    <div className={`flex flex-col gap-5 border-t pt-4 md:gap-8 ${tone === "paper" ? "border-paper-line" : "border-line"}`}>
      <p className={`label flex justify-between ${tone === "paper" ? "text-paper-muted" : "text-muted"}`}>
        <span>({index})</span>
        <span>{label}</span>
      </p>
      <h2 id={id} data-reveal className="display text-[clamp(3rem,11vw,11.5rem)]">
        {title}
      </h2>
    </div>
  );
}
