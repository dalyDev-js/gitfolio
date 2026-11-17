import { Logo } from "@/components/site-header";
import { UsernameForm } from "@/components/username-form";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl px-4 py-5 sm:px-6">
        <Logo />
      </header>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <p className="font-mono text-sm text-muted">404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          No GitHub user by that name
        </h1>
        <p className="mt-3 text-muted">
          Check the spelling, or try someone else.
        </p>
        <div className="mt-6 w-full">
          <UsernameForm compact />
        </div>
      </div>
    </main>
  );
}
