import type { Metadata } from "next";
import Link from "next/link";

import { ProgressOverview } from "@/components/progress/progress-overview";
import { EmptyState } from "@/components/ui/empty-state";
import { PageTitle } from "@/components/ui/page-title";
import { requirePageUser } from "@/lib/auth/user";
import { getExerciseProgress } from "@/lib/data/progress";

export const metadata: Metadata = {
  description: "Review MuscleMAX personal records and strength trends.",
  title: "Progress",
};

export default async function ProgressPage() {
  const user = await requirePageUser();
  const exercises = await getExerciseProgress(user.id);

  return (
    <div className="space-y-8">
      <PageTitle description="Celebrate your best sets and spot strength trends over time.">
        Progress
      </PageTitle>
      {exercises.length === 0 ? (
        <EmptyState
          action={
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-green-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
              href="/workouts"
            >
              Log a workout
            </Link>
          }
          description="Complete a workout to start building personal records and progress charts."
          title="No progress to show yet"
        />
      ) : (
        <ProgressOverview exercises={exercises} />
      )}
    </div>
  );
}
