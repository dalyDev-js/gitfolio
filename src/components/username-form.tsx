"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const USERNAME_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

function clean(raw: string) {
  return raw
    .trim()
    .replace(/^@/, "")
    .replace(/^(https?:\/\/)?(www\.)?github\.com\//i, "")
    .split(/[/?#]/)[0];
}

export function UsernameForm({ autoFocus = false, compact = false }: { autoFocus?: boolean; compact?: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = clean(value);
    if (!USERNAME_RE.test(name)) {
      setError("That doesn't look like a GitHub username.");
      return;
    }
    setError(null);
    startTransition(() => router.push(`/${name}`));
  }

  return (
    <form onSubmit={submit} className="w-full" noValidate>
      <div
        className={`group flex items-center rounded-2xl border border-border bg-surface shadow-sm transition focus-within:border-accent focus-within:ring-4 focus-within:ring-[var(--ring)] ${
          compact ? "h-11 pl-3 pr-1" : "h-14 pl-4 pr-1.5"
        }`}
      >
        <span className="select-none font-mono text-sm text-muted">github.com/</span>
        <input
          aria-label="GitHub username"
          autoFocus={autoFocus}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="username"
          className="min-w-0 flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-muted/60 sm:text-base"
        />
        <button
          type="submit"
          disabled={pending || !value.trim()}
          className={`rounded-xl bg-fg font-medium text-bg transition hover:opacity-90 disabled:opacity-40 ${
            compact ? "h-9 px-3 text-sm" : "h-11 px-5 text-sm"
          }`}
        >
          {pending ? "Building…" : "Build"}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </form>
  );
}
