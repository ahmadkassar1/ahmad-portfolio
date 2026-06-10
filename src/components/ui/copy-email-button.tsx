"use client";

import { useEffect, useRef, useState } from "react";

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be unavailable (permissions, non-secure context) —
      // the visible mailto link next to this button still works.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-full border border-line px-6 py-3 font-mono text-sm text-ink transition-colors hover:border-accent-bright hover:text-accent-bright"
    >
      {/* Both labels share one grid cell so the button keeps the wider
          (email) width while showing the confirmation. */}
      <span className="grid text-center">
        <span className={`col-start-1 row-start-1 ${copied ? "invisible" : ""}`}>
          {email}
        </span>
        <span className={`col-start-1 row-start-1 ${copied ? "" : "invisible"}`}>
          Copied to clipboard
        </span>
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </button>
  );
}
