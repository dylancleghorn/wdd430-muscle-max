import { PageTitle } from "@/components/ui/page-title";
import { WorkoutList } from "@/components/workouts/workout-list";
import { requirePageUser } from "@/lib/auth/user";
import { listWorkoutRoutines } from "@/lib/data/workouts";

export const metadata: Metadata = {
  description: "Create and manage your private workout routines.",
  title: "Workout routines",
};

export default async function WorkoutsPage() {
  const user = await requirePageUser();
  const routines = await listWorkoutRoutines(user.id);

  return (
    <div className="space-y-8">
      <PageTitle description="Build routines for the workouts you want to repeat.">
        Workout routines
      </PageTitle>
      <WorkoutList routines={routines} />
    </div>
  );
}
import type { Metadata } from "next";
