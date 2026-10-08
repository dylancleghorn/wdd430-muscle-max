import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RoutineEditor } from "@/components/workouts/routine-editor";
import { SessionLogger } from "@/components/workouts/session-logger";
import { requirePageUser } from "@/lib/auth/user";
import { listRoutineExercises } from "@/lib/data/exercises";
import { getWorkoutRoutine } from "@/lib/data/workouts";

export const metadata: Metadata = {
  description: "Edit exercises and details for one of your workout routines.",
  title: "Edit workout routine",
};

type WorkoutDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function WorkoutDetailPage({
  params,
}: WorkoutDetailPageProps) {
  const user = await requirePageUser();
  const { id } = await params;
  const routine = await getWorkoutRoutine(user.id, id);

  if (!routine) {
    notFound();
  }

  const exercises = await listRoutineExercises(user.id, id);

  if (!exercises) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <RoutineEditor exercises={exercises} routine={routine} />
      <SessionLogger exercises={exercises} routine={routine} />
    </div>
  );
}
