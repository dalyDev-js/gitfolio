"use client";

import { useMemo, useState } from "react";
import type { Repo } from "@/lib/shared";
import { languageColor } from "@/lib/shared";
import { RepoCard } from "./repo-card";

type Sort = "pushed" | "stars" | "name";

export function RepoExplorer({ repos }: { repos: Repo[] }) {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("pushed");
  const [showForks, setShowForks] = useState(false);
  const [limit, setLimit] = useState(12);

  const languages = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of repos) if (r.language && (showForks || !r.fork)) m.set(r.language, (m.get(r.language) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [repos, showForks]);

  const forkCount = repos.filter((r) => r.fork).length;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return repos
      .filter((r) => showForks || !r.fork)
      .filter((r) => !lang || r.language === lang)
      .filter(
        (r) =>
          !q ||
          r.name.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.topics?.some((t) => t.includes(q)),
      )
      .sort((a, b) =>
        sort === "stars"
          ? b.stargazers_count - a.stargazers_count
          : sort === "name"
            ? a.name.localeCompare(b.name)
            : Date.parse(b.pushed_at) - Date.parse(a.pushed_at),
      );
  }, [repos, query, lang, sort, showForks]);

  const chip = (active: boolean) =>
    `inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs transition ${
      active ? "border-fg bg-fg text-bg" : "border-border bg-surface text-muted hover:text-fg"
    }`;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLimit(12);
          }}
          placeholder="Search projects"
          aria-label="Search projects"
          className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-[var(--ring)] sm:max-w-xs"
        />
        <div className="flex items-center gap-2 sm:ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort projects"
            className="h-10 rounded-xl border border-border bg-surface px-3 text-sm outline-none"
          >
            <option value="pushed">Recently updated</option>
            <option value="stars">Most stars</option>
            <option value="name">Name</option>
          </select>
          {forkCount > 0 && (
            <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface px-3 text-sm text-muted">
              <input type="checkbox" checked={showForks} onChange={(e) => setShowForks(e.target.checked)} className="accent-[var(--accent)]" />
              Forks
            </label>
          )}
        </div>
      </div>

      {languages.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button className={chip(lang === null)} onClick={() => setLang(null)}>
            All
          </button>
          {languages.map(([name, n]) => (
            <button key={name} className={chip(lang === name)} onClick={() => setLang(lang === name ? null : name)}>
              <span className="size-2 rounded-full" style={{ background: languageColor(name) }} />
              {name}
              <span className="opacity-60">{n}</span>
            </button>
          ))}
        </div>
      )}

      {list.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted">
          No projects match that.
        </p>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.slice(0, limit).map((r) => (
            <RepoCard key={r.id} repo={r} />
          ))}
        </div>
      )}
      {list.length > limit && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setLimit((l) => l + 12)}
            className="h-10 rounded-xl border border-border bg-surface px-4 text-sm transition hover:border-accent"
          >
            Show more ({list.length - limit} left)
          </button>
        </div>
      )}
    </div>
  );
}
