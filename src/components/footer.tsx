import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-serif text-lg italic text-ink" aria-hidden="true">
            ak<span className="text-accent-bright">.</span>
          </p>
          <p className="mt-1 text-sm text-ink-faint">
            © {new Date().getFullYear()} {site.name}. Designed and built by
            hand — Next.js, Tailwind CSS, Motion.
          </p>
        </div>
        <ul className="flex gap-6 font-mono text-xs">
          <li>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-soft transition-colors hover:text-accent-bright"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-soft transition-colors hover:text-accent-bright"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href={`mailto:${site.email}`}
              className="text-ink-soft transition-colors hover:text-accent-bright"
            >
              Email
            </a>
          </li>
          <li>
            <a
              href="#main"
              className="text-ink-soft transition-colors hover:text-accent-bright"
            >
              Top <span aria-hidden="true">↑</span>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
