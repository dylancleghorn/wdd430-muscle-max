import { notFound } from "next/navigation";

import { RoutineEditor } from "@/components/workouts/routine-editor";
import { requirePageUser } from "@/lib/auth/user";
import { listRoutineExercises } from "@/lib/data/exercises";
import { getWorkoutRoutine } from "@/lib/data/workouts";

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

  return <RoutineEditor exercises={exercises} routine={routine} />;
}
