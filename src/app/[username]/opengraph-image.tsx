import { ImageResponse } from "next/og";
import { getProfile, languageStats } from "@/lib/github";

export const alt = "GitFolio developer portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);
}

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const data = await getProfile(username);

  if (data.status !== "ok") {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0c0c0f", color: "#ececf1", fontSize: 64, fontWeight: 600 }}>
          gitfolio
        </div>
      ),
      size,
    );
  }

  const { user, repos } = data;
  const own = repos.filter((r) => !r.fork);
  const stars = own.reduce((s, r) => s + r.stargazers_count, 0);
  const langs = languageStats(repos).slice(0, 5);
  const accent = langs[0]?.color ?? "#8b8bff";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0c0c0f",
          backgroundImage: `radial-gradient(ellipse 70% 60% at 85% 0%, ${accent}44, transparent 70%)`,
          color: "#ececf1",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <img src={`${user.avatar_url}${user.avatar_url.includes("?") ? "&" : "?"}s=320`} width={168} height={168} style={{ borderRadius: 40, border: "2px solid #26262d" }} alt="" />
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", fontSize: 30, color: "#9a99a3" }}>{`@${user.login}`}</div>
            <div style={{ display: "flex", fontSize: 68, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05, marginTop: 6 }}>
              {(user.name || user.login).slice(0, 28)}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#b9b8c2", marginTop: 36, lineHeight: 1.35, maxHeight: 82, overflow: "hidden" }}>
          {(user.bio || `${user.public_repos} public repositories on GitHub.`).slice(0, 120)}
        </div>
        <div style={{ display: "flex", marginTop: "auto", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 56 }}>
            {[
              ["repos", user.public_repos],
              ["stars", stars],
              ["followers", user.followers],
            ].map(([label, v]) => (
              <div key={label as string} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: 52, fontWeight: 700 }}>{fmt(v as number)}</div>
                <div style={{ display: "flex", fontSize: 24, color: "#9a99a3" }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14 }}>
            <div style={{ display: "flex", gap: 18 }}>
              {langs.slice(0, 3).map((l) => (
                <div key={l.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 24, color: "#cfced6" }}>
                  <div style={{ display: "flex", width: 14, height: 14, borderRadius: 7, background: l.color }} />
                  {l.name}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: "#ececf1" }}>gitfolio</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
