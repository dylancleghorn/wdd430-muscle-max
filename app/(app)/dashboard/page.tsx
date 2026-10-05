import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { PageTitle } from "@/components/ui/page-title";
import { SessionList } from "@/components/workouts/session-list";
import { requirePageUser } from "@/lib/auth/user";
import { getDashboardSummary } from "@/lib/data/sessions";

export default async function DashboardPage() {
  const user = await requirePageUser();
  const { recentSessions, totalSessions } = await getDashboardSummary(user.id);

  return (
    <div className="space-y-8">
      <PageTitle description="Your recent activity and workout consistency.">
        Dashboard
      </PageTitle>
      <section className="rounded-xl border border-slate-700 bg-slate-800 p-6">
        <p className="text-sm font-medium text-slate-400">Completed workouts</p>
        <p className="mt-2 text-4xl font-bold text-green-400">
          {totalSessions}
        </p>
      </section>
      {recentSessions.length === 0 ? (
        <EmptyState
          action={
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-green-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
              href="/workouts"
            >
              Create a routine
            </Link>
          }
          description="Complete a routine to begin building your workout history."
          title="Your training space is ready"
        />
      ) : (
        <section>
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-2xl font-semibold text-slate-50">
              Recent workouts
            </h2>
            <Link
              className="font-semibold text-green-400 hover:text-green-300"
              href="/history"
            >
              View all history
            </Link>
          </div>
          <SessionList sessions={recentSessions} />
        </section>
      )}
    </div>
  );
}
