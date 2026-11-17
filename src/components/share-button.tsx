"use client";

import { useState } from "react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ url, title: document.title });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* user cancelled */
    }
  }

  return (
    <button
      onClick={share}
      className="inline-flex h-9 items-center gap-2 rounded-xl bg-fg px-3.5 text-sm font-medium text-bg transition hover:opacity-90"
    >
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
