import Link from "next/link";
import { Logo } from "@/components/site-header";
import { UsernameForm } from "@/components/username-form";

const EXAMPLES = ["dalyDev-js", "torvalds", "gaearon", "sindresorhus", "vercel"];

export default function Home() {
  return (
    <main className="grain flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <a
          href="https://github.com/dalyDev-js/gitfolio"
          className="text-sm text-muted transition hover:text-fg"
        >
          Source
        </a>
      </header>

      <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 pb-24 pt-10 text-center sm:px-6">
        <p className="rise mb-5 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
          No sign-up. Just a username.
        </p>
        <h1 className="rise text-balance text-4xl font-semibold tracking-tight sm:text-6xl" style={{ animationDelay: "60ms" }}>
          Your GitHub,
          <br />
          <span className="text-accent">as a portfolio.</span>
        </h1>
        <p className="rise mt-5 max-w-md text-pretty text-muted sm:text-lg" style={{ animationDelay: "120ms" }}>
          Type a username and get a clean page with your best projects, languages and activity. Share
          it as <span className="font-mono text-fg">gitfolio/you</span>.
        </p>
        <div className="rise mt-9 w-full max-w-lg" style={{ animationDelay: "180ms" }}>
          <UsernameForm autoFocus />
        </div>
        <div className="rise mt-6 flex flex-wrap items-center justify-center gap-2 text-sm" style={{ animationDelay: "240ms" }}>
          <span className="text-muted">Try</span>
          {EXAMPLES.map((name) => (
            <Link
              key={name}
              href={`/${name}`}
              className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs transition hover:border-accent hover:text-accent"
            >
              {name}
            </Link>
          ))}
        </div>
      </section>

      <footer className="mx-auto w-full max-w-5xl px-4 py-6 text-center text-xs text-muted sm:px-6">
        Built with Next.js 16 and the public GitHub API. Day 3 of Everyday App.
      </footer>
    </main>
  );
}
