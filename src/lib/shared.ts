// Safe to import from client components (no server-only APIs).

export type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  type: "User" | "Organization";
};

export type Repo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  updated_at: string;
};

const COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  HTML: "#e34c26",
  CSS: "#663399",
  SCSS: "#c6538c",
  Shell: "#89e051",
  Dart: "#00B4AB",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Astro: "#ff5a03",
  Lua: "#000080",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Scala: "#c22d40",
  Zig: "#ec915c",
  "Jupyter Notebook": "#DA5B0B",
  MDX: "#fcb32c",
  Dockerfile: "#384d54",
  Nix: "#7e7eff",
  "Objective-C": "#438eff",
  R: "#198CE7",
  Clojure: "#db5855",
  OCaml: "#ef7a08",
  Solidity: "#AA6746",
  "Vim Script": "#199f4b",
  "Emacs Lisp": "#c065db",
  TeX: "#3D6117",
  Makefile: "#427819",
};

export function languageColor(name: string | null) {
  if (!name) return "#8b8b8b";
  if (COLORS[name]) return COLORS[name];
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return `hsl(${h} 55% 55%)`;
}
