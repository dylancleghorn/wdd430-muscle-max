import type { ReactNode } from "react";
import Link from "next/link";

import { AppFooter } from "@/components/app-footer";

type LegalPageProps = {
  children: ReactNode;
  description: string;
  title: string;
};

export function LegalPage({ children, description, title }: LegalPageProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-slate-800 bg-slate-950/95">
        <div className="mx-auto flex max-w-3xl items-center px-4 py-4 sm:px-6">
          <Link
            className="text-xl font-bold tracking-tight text-slate-50"
            href="/"
          >
            Muscle<span className="text-green-400">MAX</span>
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <article className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-xl shadow-slate-950/20 sm:p-10">
          <p className="text-sm font-semibold tracking-[0.2em] text-green-400">
            MUSCLEMAX
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">{description}</p>
          <p className="mt-4 text-sm text-slate-400">
            Last updated: October 1, 2026
          </p>
          <div className="mt-10 space-y-8 text-slate-300">{children}</div>
        </article>
      </main>
      <AppFooter />
    </div>
  );
}
