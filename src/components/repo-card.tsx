import type { Repo } from "@/lib/shared";
import { languageColor } from "@/lib/shared";
import { Arrow, Fork, Star } from "./icons";

export function formatCount(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);
}

export function formatMonth(iso: string) {
  return new Date(iso).toLocaleDateString("en", { month: "short", year: "numeric", timeZone: "UTC" });
}

export function RepoCard({ repo, featured = false }: { repo: Repo; featured?: boolean }) {
  const homepage = repo.homepage && /^https?:\/\//.test(repo.homepage) ? repo.homepage : null;
  return (
    <article
      className={`group relative flex flex-col rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] hover:shadow-[0_8px_30px_-12px_var(--ring)] ${
        featured ? "min-h-44" : "min-h-36"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="truncate font-mono text-[15px] font-semibold">
          <a href={repo.html_url} target="_blank" rel="noreferrer" className="after:absolute after:inset-0">
            {repo.name}
          </a>
        </h3>
        <Arrow className="size-4 shrink-0 text-muted opacity-0 transition group-hover:opacity-100" />
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-muted">
        {repo.description || <span className="italic opacity-70">No description yet.</span>}
      </p>
      {featured && repo.topics && repo.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 4).map((t) => (
            <span key={t} className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted">
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="mt-auto flex items-center gap-4 pt-4 text-xs text-muted">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ background: languageColor(repo.language) }} />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1">
            <Star /> {formatCount(repo.stargazers_count)}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="flex items-center gap-1">
            <Fork /> {formatCount(repo.forks_count)}
          </span>
        )}
        <span className="ml-auto">{formatMonth(repo.pushed_at)}</span>
      </div>
      {homepage && (
        <a
          href={homepage}
          target="_blank"
          rel="noreferrer"
          className="relative z-10 mt-3 inline-flex w-fit items-center gap-1 text-xs font-medium text-accent hover:underline"
        >
          Live demo <Arrow className="size-3" />
        </a>
      )}
    </article>
  );
}
