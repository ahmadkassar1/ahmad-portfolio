"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

const links = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
  { href: "#toolbox", label: "Toolbox" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    // The panel only exists below md — if the viewport crosses the breakpoint
    // while open, close so the body scroll lock can't outlive its controls.
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    // Keep Tab inside the menu: content behind the opaque panel stays in the
    // DOM, so without inert it would still receive (invisible) focus.
    const obscured = [
      document.getElementById("main"),
      document.querySelector("footer"),
    ];
    obscured.forEach((el) => el?.setAttribute("inert", ""));
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onBreakpoint);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onBreakpoint);
      document.body.style.overflow = "";
      obscured.forEach((el) => el?.removeAttribute("inert"));
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
      <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${
        solid
          ? "border-line bg-paper/90 backdrop-blur-sm"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6"
      >
        <a
          href="#main"
          className="font-serif text-xl italic text-ink"
          aria-label="Ahmad Kassar — back to top"
        >
          ak<span className="text-accent">.</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Get in touch
          </a>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 flex h-10 w-10 items-center justify-center text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="17" y2="7" />
                <line x1="3" y1="13" x2="17" y2="13" />
              </>
            )}
          </svg>
        </button>
        </nav>
      </header>

      {/* Lives outside <header>: its backdrop-filter creates a containing
          block that would collapse this fixed panel to zero height. */}
      {open ? (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto bg-paper pb-8 md:hidden"
        >
          <ul className="flex flex-col gap-2 px-6 pt-8">
            {links.map((link, index) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line py-4 text-2xl font-medium tracking-tight text-ink"
                >
                  <span className="mr-4 font-mono text-sm text-accent" aria-hidden="true">
                    0{index + 1}
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="block py-4 text-2xl font-medium tracking-tight text-accent"
              >
                <span className="mr-4 font-mono text-sm" aria-hidden="true">
                  05
                </span>
                Get in touch
              </a>
            </li>
          </ul>
          <p className="px-6 pt-8 font-mono text-xs text-ink-faint">
            {site.location} · {site.email}
          </p>
        </div>
      ) : null}
    </>
  );
}
