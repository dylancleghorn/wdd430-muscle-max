import "server-only";

import { listWorkoutSessions } from "@/lib/data/sessions";

export type ProgressPoint = {
  completedAt: string;
  estimatedOneRepMax: number;
};

export type ExerciseProgress = {
  exerciseName: string;
  points: ProgressPoint[];
  record: {
    completedAt: string;
    estimatedOneRepMax: number | null;
    reps: number;
    weight: number | null;
  };
};

function estimateOneRepMax(weight: number, reps: number): number {
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

export async function getExerciseProgress(
  userId: string,
): Promise<ExerciseProgress[]> {
  const sessions = await listWorkoutSessions(userId);
  const exerciseProgress = new Map<string, ExerciseProgress>();

  for (const session of sessions) {
    for (const set of session.completedSets) {
      const key = set.exerciseName.trim().toLocaleLowerCase();
      const estimate =
        set.actualWeight === null
          ? null
          : estimateOneRepMax(set.actualWeight, set.actualReps);
      const candidateScore = estimate ?? set.actualReps;
      const existing = exerciseProgress.get(key);

      if (!existing) {
        exerciseProgress.set(key, {
          exerciseName: set.exerciseName,
          points:
            estimate === null
              ? []
              : [
                  {
                    completedAt: session.completedAt,
                    estimatedOneRepMax: estimate,
                  },
                ],
          record: {
            completedAt: session.completedAt,
            estimatedOneRepMax: estimate,
            reps: set.actualReps,
            weight: set.actualWeight,
          },
        });
        continue;
      }

      if (estimate !== null) {
        existing.points.push({
          completedAt: session.completedAt,
          estimatedOneRepMax: estimate,
        });
      }

      const recordScore =
        existing.record.estimatedOneRepMax ?? existing.record.reps;
      if (candidateScore > recordScore) {
        existing.record = {
          completedAt: session.completedAt,
          estimatedOneRepMax: estimate,
          reps: set.actualReps,
          weight: set.actualWeight,
        };
      }
    }
  }

  return [...exerciseProgress.values()]
    .map((exercise) => ({
      ...exercise,
      points: exercise.points
        .sort(
          (left, right) =>
            new Date(left.completedAt).getTime() -
            new Date(right.completedAt).getTime(),
        )
        .slice(-8),
    }))
    .sort((left, right) => left.exerciseName.localeCompare(right.exerciseName));
}
