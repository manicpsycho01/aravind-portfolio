import Image from "next/image";
import type { Shot } from "@/content/site";

/** Browser chrome, phone bezel or bare image around a screenshot. */
export function DeviceFrame({
  shot,
  sizes,
  priority,
  className,
}: {
  shot: Shot;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const image = (
    <Image
      src={shot.src}
      alt={shot.alt}
      width={shot.w}
      height={shot.h}
      sizes={sizes}
      priority={priority}
      className="block h-auto w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
    />
  );

  if (shot.device === "phone") {
    return (
      <div className={`mx-auto w-full max-w-[22rem] rounded-[2.4rem] bg-ink p-2.5 shadow-2xl shadow-ink/25 ${className ?? ""}`}>
        <div className="overflow-hidden rounded-[1.9rem]">{image}</div>
      </div>
    );
  }
  if (shot.device === "browser") {
    return (
      <div className={`overflow-hidden rounded-lg bg-graphite p-1 shadow-2xl shadow-ink/25 md:rounded-xl ${className ?? ""}`}>
        <div className="flex items-center gap-1.5 px-2.5 py-2 md:px-3 md:py-2.5" aria-hidden>
          <span className="size-2 rounded-full bg-paper/25" />
          <span className="size-2 rounded-full bg-paper/25" />
          <span className="size-2 rounded-full bg-paper/25" />
          <span className="ml-3 hidden h-4 w-1/3 rounded-full bg-paper/10 sm:block" />
        </div>
        <div className="overflow-hidden rounded-md">{image}</div>
      </div>
    );
  }
  return <div className={`overflow-hidden ${className ?? ""}`}>{image}</div>;
}
