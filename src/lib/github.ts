import { cacheLife, cacheTag } from "next/cache";
import { languageColor, type GitHubUser, type Repo } from "./shared";

export { languageColor };
export type { GitHubUser, Repo };

const API = process.env.GITHUB_API_URL ?? "https://api.github.com";

export type ProfileResult =
  | { status: "ok"; user: GitHubUser; repos: Repo[]; fetchedAt: number }
  | { status: "not_found" }
  | { status: "rate_limited"; resetAt: number | null }
  | { status: "error"; message: string };

const USERNAME_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export function isValidUsername(name: string) {
  return USERNAME_RE.test(name);
}

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "gitfolio-app",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

function rateLimited(res: Response) {
  return (
    res.status === 429 ||
    (res.status === 403 && res.headers.get("x-ratelimit-remaining") === "0")
  );
}

function resetAt(res: Response) {
  const v = res.headers.get("x-ratelimit-reset");
  return v ? Number(v) * 1000 : null;
}

/** Fetches a user and their public, owned repos. Cached for an hour per username. */
export async function getProfile(username: string): Promise<ProfileResult> {
  "use cache";
  cacheTag(`profile:${username.toLowerCase()}`);

  if (!isValidUsername(username)) {
    cacheLife("days");
    return { status: "not_found" };
  }

  try {
    const userRes = await fetch(`${API}/users/${encodeURIComponent(username)}`, {
      headers: headers(),
    });
    if (userRes.status === 404) {
      cacheLife("hours");
      return { status: "not_found" };
    }
    if (rateLimited(userRes)) {
      cacheLife("seconds");
      return { status: "rate_limited", resetAt: resetAt(userRes) };
    }
    if (!userRes.ok) {
      cacheLife("seconds");
      return { status: "error", message: `GitHub answered ${userRes.status}` };
    }
    const user = (await userRes.json()) as GitHubUser;

    const repos: Repo[] = [];
    const kind = user.type === "Organization" ? "orgs" : "users";
    for (let page = 1; page <= 3; page++) {
      const res = await fetch(
        `${API}/${kind}/${encodeURIComponent(user.login)}/repos?per_page=100&sort=pushed&page=${page}${
          kind === "users" ? "&type=owner" : ""
        }`,
        { headers: headers() },
      );
      if (rateLimited(res)) {
        cacheLife("seconds");
        return { status: "rate_limited", resetAt: resetAt(res) };
      }
      if (!res.ok) break;
      const batch = (await res.json()) as Repo[];
      repos.push(
        ...batch.map((r) => ({
          id: r.id,
          name: r.name,
          full_name: r.full_name,
          html_url: r.html_url,
          description: r.description,
          homepage: r.homepage,
          language: r.language,
          stargazers_count: r.stargazers_count,
          forks_count: r.forks_count,
          topics: r.topics ?? [],
          fork: r.fork,
          archived: r.archived,
          pushed_at: r.pushed_at,
          updated_at: r.updated_at,
        })),
      );
      if (batch.length < 100) break;
    }

    cacheLife("hours");
    return { status: "ok", user, repos, fetchedAt: Date.now() };
  } catch (err) {
    cacheLife("seconds");
    return { status: "error", message: err instanceof Error ? err.message : "Network error" };
  }
}

export type LanguageStat = { name: string; count: number; share: number; color: string };

export function languageStats(repos: Repo[]): LanguageStat[] {
  const counts = new Map<string, number>();
  for (const r of repos) {
    if (r.fork || !r.language) continue;
    counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0) || 1;
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count, share: count / total, color: languageColor(name) }));
}

export function featuredRepos(repos: Repo[], n = 6) {
  return repos
    .filter((r) => !r.fork && !r.archived)
    .sort(
      (a, b) =>
        b.stargazers_count + b.forks_count * 0.5 - (a.stargazers_count + a.forks_count * 0.5) ||
        Date.parse(b.pushed_at) - Date.parse(a.pushed_at),
    )
    .slice(0, n);
}

/** Repos pushed per month over the last 12 months, oldest first. */
export function activityByMonth(repos: Repo[], now = new Date()) {
  const months: { label: string; key: string; count: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    months.push({
      key: `${d.getUTCFullYear()}-${d.getUTCMonth()}`,
      label: d.toLocaleString("en", { month: "short", timeZone: "UTC" }),
      count: 0,
    });
  }
  for (const r of repos) {
    const d = new Date(r.pushed_at);
    const m = months.find((x) => x.key === `${d.getUTCFullYear()}-${d.getUTCMonth()}`);
    if (m) m.count++;
  }
  return months;
}

