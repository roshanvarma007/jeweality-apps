"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/markdown";

/** Table of contents: sticky list on desktop (highlights the current section), collapsible on mobile. */
export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-90px 0px -70% 0px" },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  const list = (
    <ol className="space-y-1 text-[0.92rem]">
      {items.map((item) => (
        <li key={item.id} className={item.level === 3 ? "pl-4" : ""}>
          <a
            href={`#${item.id}`}
            aria-current={active === item.id ? "location" : undefined}
            className="flex gap-2 border-l-2 border-transparent py-1 pl-3 text-muted transition-colors hover:text-ink aria-[current=location]:border-accent aria-[current=location]:font-medium aria-[current=location]:text-ink"
          >
            {item.number !== undefined && (
              <span className="w-5 shrink-0 text-right tabular-nums opacity-70">
                {item.number}.
              </span>
            )}
            <span>{item.text}</span>
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      {/* Mobile / tablet */}
      <details className="card group mb-10 p-5 lg:hidden" data-no-print>
        <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-ink">
          On this page
          <svg
            viewBox="0 0 24 24"
            className="size-5 transition-transform group-open:rotate-180"
            fill="none"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </summary>
        <nav aria-label="Table of contents" className="mt-4">
          {list}
        </nav>
      </details>

      {/* Desktop */}
      <nav
        aria-label="Table of contents"
        className="sticky top-24 hidden max-h-[calc(100dvh-8rem)] overflow-y-auto lg:block"
        data-no-print
      >
        <p className="mb-3 text-xs font-bold tracking-[0.12em] text-ink uppercase">On this page</p>
        {list}
      </nav>
    </>
  );
}
