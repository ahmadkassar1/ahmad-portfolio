import { MetaLabel } from "@/components/meta-label";
import { featuredWork } from "@/data/featured-work";

export function FeaturedWork() {
  return (
    <article className="mt-12 grid gap-8 rounded-2xl border border-accent/30 bg-panel p-6 sm:p-10 lg:grid-cols-2">
      <div>
        <MetaLabel>Featured build · Frontend challenge</MetaLabel>
        <h3 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {featuredWork.name}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">{featuredWork.summary}</p>
        <ul aria-label="Project technologies" className="mt-6 flex flex-wrap gap-2">
          {featuredWork.stack.map((technology) => (
            <li key={technology} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-ink-soft">
              {technology}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col justify-between gap-6">
        <ul className="space-y-4 text-sm leading-relaxed text-ink-soft">
          {featuredWork.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
        </ul>
        <div className="flex flex-wrap gap-3">
          <a href={featuredWork.links.demo} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-bright">
            Try the course player ↗
          </a>
          <a href={featuredWork.links.source} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-line-bright">
            View source ↗
          </a>
        </div>
        <p className="text-xs leading-relaxed text-ink-faint">Learning state is saved on your device. Community comments and leaderboard peers are labeled sample data.</p>
      </div>
    </article>
  );
}
