import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { PageTitle } from "@/components/ui/page-title";
import { SessionList } from "@/components/workouts/session-list";
import { requirePageUser } from "@/lib/auth/user";
import { listWorkoutSessions } from "@/lib/data/sessions";

export const metadata: Metadata = {
  description: "Review your completed MuscleMAX workouts.",
  title: "Workout history",
};

export default async function HistoryPage() {
  const user = await requirePageUser();
  const sessions = await listWorkoutSessions(user.id);

  return (
    <div className="space-y-8">
      <PageTitle description="Review the completed workouts you have saved.">
        Workout history
      </PageTitle>
      {sessions.length === 0 ? (
        <EmptyState
          action={
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-green-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
              href="/workouts"
            >
              View routines
            </Link>
          }
          description="Finish a workout from one of your routines to add it here."
          title="No completed workouts yet"
        />
      ) : (
        <SessionList sessions={sessions} />
      )}
    </div>
  );
}
