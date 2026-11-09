"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppGrid } from "@/components/AppCard";
import type { AppEntry, Category } from "@/lib/apps";

type Sort = "newest" | "az";

interface Props {
  apps: AppEntry[];
  categories: readonly Category[];
}

/**
 * Client-side search + category filter + sort for /apps.
 * State lives in the URL (?q=…&category=games&sort=az) so any view can be shared.
 */
export function SearchFilter({ apps, categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const categoryParam = params.get("category")?.toLowerCase() ?? "all";
  const activeCategory =
    categories.find((c) => c.toLowerCase() === categoryParam)?.toLowerCase() ?? "all";
  const sort: Sort = params.get("sort") === "az" ? "az" : "newest";
  const urlQuery = params.get("q") ?? "";

  const [query, setQuery] = useState(urlQuery);
  const [debounced, setDebounced] = useState(urlQuery);

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(changes)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Debounce typing (200ms), then reflect it in the URL.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 200);
    return () => clearTimeout(t);
  }, [query]);
  useEffect(() => {
    if (debounced !== urlQuery) update({ q: debounced.trim() || null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const results = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    const list = apps.filter((a) => {
      const inCategory = activeCategory === "all" || a.category.toLowerCase() === activeCategory;
      const matches =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.tagline.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q);
      return inCategory && matches;
    });
    // `apps` already arrives sorted newest-first (live before coming-soon).
    return sort === "az" ? [...list].sort((a, b) => a.name.localeCompare(b.name)) : list;
  }, [apps, activeCategory, debounced, sort]);

  const filters = ["all", ...categories.map((c) => c.toLowerCase())];
  const labelFor = (f: string) =>
    f === "all" ? "All" : (categories.find((c) => c.toLowerCase() === f) ?? f);
  const countFor = (f: string) =>
    f === "all" ? apps.length : apps.filter((a) => a.category.toLowerCase() === f).length;

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <label htmlFor="app-search" className="sr-only">
            Search apps
          </label>
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            id="app-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apps by name or description"
            autoComplete="off"
            className="h-12 w-full rounded-full border border-line bg-white pr-4 pl-12 text-base text-ink shadow-sm transition-colors placeholder:text-muted/80 hover:border-[#cfd2dc] focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="app-sort" className="text-sm font-medium text-muted">
            Sort
          </label>
          <select
            id="app-sort"
            value={sort}
            onChange={(e) => update({ sort: e.target.value === "az" ? "az" : null })}
            className="h-11 rounded-full border border-line bg-white px-4 text-[0.95rem] font-medium text-ink shadow-sm hover:border-[#cfd2dc]"
          >
            <option value="newest">Recently updated</option>
            <option value="az">A–Z</option>
          </select>
        </div>
      </div>

      <div
        role="group"
        aria-label="Filter by category"
        className="-mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]"
      >
        {filters.map((f) => {
          const active = f === activeCategory;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => update({ category: f === "all" ? null : f })}
              className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[0.95rem] font-medium transition-colors ${
                active
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-white text-ink-soft hover:border-[#cfd2dc] hover:text-ink"
              }`}
            >
              {labelFor(f)}
              <span
                className={`rounded-full px-1.5 text-xs ${active ? "bg-white/20" : "bg-surface text-muted"}`}
              >
                {countFor(f)}
              </span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {results.length} {results.length === 1 ? "app" : "apps"} found
      </p>

      <div className="mt-10">
        {results.length ? (
          <AppGrid apps={results} headingLevel="h2" />
        ) : (
          <div className="card flex flex-col items-center px-6 py-16 text-center">
            <p className="text-lg font-semibold text-ink">No apps found. Try a different search.</p>
            <button
              type="button"
              onClick={() => {
                // The debounce effect then sees "" === urlQuery and leaves the URL alone.
                setQuery("");
                update({ q: null, category: null });
              }}
              className="btn btn-secondary mt-6"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
