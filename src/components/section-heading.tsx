import { Reveal } from "@/components/motion/reveal";

type SectionHeadingProps = {
  index: string;
  title: string;
  lede?: string;
};

export function SectionHeading({ index, title, lede }: SectionHeadingProps) {
  return (
    <Reveal>
      <div className="flex items-baseline gap-4">
        <span aria-hidden="true" className="font-mono text-sm text-accent">
          {index}
        </span>
        <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h2>
      </div>
      {lede ? (
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
          {lede}
        </p>
      ) : null}
    </Reveal>
  );
}
