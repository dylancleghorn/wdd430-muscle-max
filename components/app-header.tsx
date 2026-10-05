import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";

type AppHeaderProps = {
  userName: string | null | undefined;
};

export function AppHeader({ userName }: AppHeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          className="text-xl font-bold tracking-tight text-slate-50"
          href="/dashboard"
        >
          Muscle<span className="text-green-400">MAX</span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-1 sm:gap-3"
        >
          <Link
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
            href="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
            href="/workouts"
          >
            Workouts
          </Link>
          <Link
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
            href="/history"
          >
            History
          </Link>
          <Link
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
            href="/profile"
          >
            Profile
          </Link>
          <span className="hidden max-w-36 truncate text-sm text-slate-400 md:inline">
            {userName || "Member"}
          </span>
          <SignOutButton />
        </nav>
      </div>
    </header>
  );
}
