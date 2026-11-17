import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Logo } from "@/components/site-header";
import { ShareButton } from "@/components/share-button";
import { RepoCard, formatCount } from "@/components/repo-card";
import { RepoExplorer } from "@/components/repo-explorer";
import { Building, Calendar, GitHubLogo, LinkIcon, Pin, XLogo } from "@/components/icons";
import { activityByMonth, featuredRepos, getProfile, languageStats } from "@/lib/github";
import { PortfolioSkeleton } from "./skeleton";

export async function generateMetadata({ params }: PageProps<"/[username]">): Promise<Metadata> {
  const { username } = await params;
  const data = await getProfile(username);
  if (data.status === "not_found") notFound();
  if (data.status !== "ok") return { title: username };
  const { user } = data;
  const name = user.name || user.login;
  const description =
    user.bio || `${name} has ${user.public_repos} public repositories on GitHub. See their best work.`;
  return {
    title: `${name} (@${user.login})`,
    description,
    openGraph: { title: `${name}'s portfolio`, description, type: "profile" },
    twitter: { card: "summary_large_image", title: `${name}'s portfolio`, description },
  };
}

export default function UserPage(props: PageProps<"/[username]">) {
  return (
    <main className="flex flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-bg/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden h-9 items-center rounded-xl border border-border bg-surface px-3.5 text-sm transition hover:border-accent sm:inline-flex"
            >
              Make yours
            </Link>
            <ShareButton />
          </div>
        </div>
      </header>
      <Suspense fallback={<PortfolioSkeleton />}>
        <Portfolio params={props.params} />
      </Suspense>
    </main>
  );
}

async function Portfolio({ params }: { params: PageProps<"/[username]">["params"] }) {
  const { username } = await params;
  const data = await getProfile(username);

  if (data.status === "not_found") notFound();
  if (data.status === "rate_limited" || data.status === "error") {
    return <Problem kind={data.status} username={username} />;
  }

  const { user, repos, fetchedAt } = data;
  const own = repos.filter((r) => !r.fork);
  const stars = own.reduce((s, r) => s + r.stargazers_count, 0);
  const forks = own.reduce((s, r) => s + r.forks_count, 0);
  const langs = languageStats(repos);
  const featured = featuredRepos(repos);
  const activity = activityByMonth(repos, new Date(fetchedAt));
  const maxActivity = Math.max(1, ...activity.map((m) => m.count));
  const accent = langs[0]?.color;
  const blog = user.blog ? (user.blog.startsWith("http") ? user.blog : `https://${user.blog}`) : null;
  const joined = new Date(user.created_at).getUTCFullYear();

  return (
    <div
      className="grain"
      style={accent ? ({ "--hero": accent } as React.CSSProperties) : undefined}
    >
      <div className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
        {/* Hero */}
        <section className="rise flex flex-col gap-6 pt-12 sm:flex-row sm:items-end sm:gap-8 sm:pt-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${user.avatar_url}${user.avatar_url.includes("?") ? "&" : "?"}s=256`}
            alt=""
            width={128}
            height={128}
            className="size-24 rounded-3xl border border-border bg-surface-2 object-cover shadow-sm sm:size-32"
          />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-sm text-muted">@{user.login}</p>
            <h1 className="mt-1 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              {user.name || user.login}
            </h1>
            {user.bio && <p className="mt-3 max-w-2xl text-pretty text-muted sm:text-lg">{user.bio}</p>}
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              {user.location && (
                <li className="flex items-center gap-1.5"><Pin /> {user.location}</li>
              )}
              {user.company && (
                <li className="flex items-center gap-1.5"><Building /> {user.company}</li>
              )}
              {blog && (
                <li>
                  <a href={blog} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-fg">
                    <LinkIcon /> {blog.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                </li>
              )}
              {user.twitter_username && (
                <li>
                  <a href={`https://x.com/${user.twitter_username}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-fg">
                    <XLogo className="size-3.5" /> @{user.twitter_username}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-1.5"><Calendar /> On GitHub since {joined}</li>
              <li>
                <a href={user.html_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-fg">
                  <GitHubLogo /> GitHub profile
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* Stats */}
        <section className="rise mt-10 grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4" style={{ animationDelay: "80ms", gap: 1 }}>
          {[
            ["Public repos", user.public_repos],
            ["Stars earned", stars],
            ["Forks", forks],
            ["Followers", user.followers],
          ].map(([label, value]) => (
            <div key={label} className="bg-surface px-5 py-4">
              <div className="text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">
                {formatCount(value as number)}
              </div>
              <div className="mt-0.5 text-xs text-muted">{label}</div>
            </div>
          ))}
        </section>

        {/* Languages + activity */}
        {(langs.length > 0 || repos.length > 0) && (
          <section className="rise mt-4 grid gap-4 md:grid-cols-5" style={{ animationDelay: "140ms" }}>
            <div className="rounded-2xl border border-border bg-surface p-5 md:col-span-3">
              <h2 className="text-sm font-medium">Languages</h2>
              {langs.length === 0 ? (
                <p className="mt-3 text-sm text-muted">No languages detected yet.</p>
              ) : (
                <>
                  <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-surface-2" role="img" aria-label="Language breakdown">
                    {langs.slice(0, 8).map((l) => (
                      <span key={l.name} style={{ width: `${l.share * 100}%`, background: l.color }} className="h-full border-r-2 border-surface last:border-r-0" />
                    ))}
                  </div>
                  <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
                    {langs.slice(0, 6).map((l) => (
                      <li key={l.name} className="flex items-center gap-2">
                        <span className="size-2.5 shrink-0 rounded-full" style={{ background: l.color }} />
                        <span className="truncate">{l.name}</span>
                        <span className="ml-auto tabular-nums text-muted">{Math.round(l.share * 100)}%</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5 md:col-span-2">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-medium">Activity</h2>
                <span className="text-xs text-muted">repos pushed per month</span>
              </div>
              <div className="mt-4 flex h-24 items-end gap-1.5" role="img" aria-label="Repos pushed per month, last 12 months">
                {activity.map((m) => (
                  <div key={m.key} className="group relative flex h-full flex-1 flex-col justify-end">
                    <div
                      className="rounded-t-[3px] bg-accent transition-opacity"
                      style={{
                        height: m.count ? `${Math.max(8, (m.count / maxActivity) * 100)}%` : "3px",
                        opacity: m.count ? 0.35 + 0.65 * (m.count / maxActivity) : 0.15,
                      }}
                    />
                    <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-fg px-1.5 py-0.5 text-[10px] text-bg opacity-0 transition group-hover:opacity-100">
                      {m.count}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-muted">
                <span>{activity[0].label}</span>
                <span>{activity[activity.length - 1].label}</span>
              </div>
            </div>
          </section>
        )}

        {/* Featured */}
        {featured.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-semibold tracking-tight">Featured work</h2>
            <p className="mt-1 text-sm text-muted">Top projects by stars and forks.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((r) => (
                <RepoCard key={r.id} repo={r} featured />
              ))}
            </div>
          </section>
        )}

        {/* All */}
        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight">All projects</h2>
          <p className="mb-5 mt-1 text-sm text-muted">{own.length} original repositories{repos.length !== own.length ? `, ${repos.length - own.length} forks` : ""}.</p>
          {repos.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted">
              {user.login} has no public repositories yet.
            </p>
          ) : (
            <RepoExplorer repos={repos} />
          )}
        </section>

        <footer className="mt-20 flex flex-col items-center gap-3 border-t border-border pt-8 text-center text-sm text-muted">
          <p>Want a page like this? It takes one username.</p>
          <Link href="/" className="inline-flex h-10 items-center rounded-xl bg-fg px-4 font-medium text-bg transition hover:opacity-90">
            Make your GitFolio
          </Link>
        </footer>
      </div>
    </div>
  );
}

function Problem({ kind, username }: { kind: "rate_limited" | "error"; username: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        {kind === "rate_limited" ? "GitHub needs a breather" : "Couldn't reach GitHub"}
      </h1>
      <p className="mt-3 text-muted">
        {kind === "rate_limited"
          ? "We've hit GitHub's hourly API limit. Give it a few minutes and refresh."
          : `Something went wrong loading @${username}. Try again in a moment.`}
      </p>
      <Link href={`/${username}`} className="mt-6 inline-flex h-10 items-center rounded-xl bg-fg px-4 text-sm font-medium text-bg">
        Try again
      </Link>
    </div>
  );
}
