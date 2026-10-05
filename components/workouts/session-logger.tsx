"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { PrimaryButton } from "@/components/ui/primary-button";
import type { RoutineExercise } from "@/lib/data/exercises";
import type { WorkoutRoutine } from "@/lib/data/workouts";

type SessionLoggerProps = {
  exercises: RoutineExercise[];
  routine: WorkoutRoutine;
};

type CompletedExercise = {
  actualReps: string;
  actualSets: string;
  actualWeight: string;
  exerciseName: string;
};

function getErrorMessage(payload: unknown, fallback: string): string {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    return payload.error;
  }

  return fallback;
}

function createInitialCompletedExercises(
  exercises: RoutineExercise[],
): CompletedExercise[] {
  return exercises.map((exercise) => ({
    actualReps: String(exercise.plannedReps),
    actualSets: String(exercise.plannedSets),
    actualWeight:
      exercise.plannedWeight === null ? "" : String(exercise.plannedWeight),
    exerciseName: exercise.name,
  }));
}

export function SessionLogger({ exercises, routine }: SessionLoggerProps) {
  const router = useRouter();
  const [completedExercises, setCompletedExercises] = useState(() =>
    createInitialCompletedExercises(exercises),
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState("");

  function updateExercise(
    index: number,
    field: Exclude<keyof CompletedExercise, "exerciseName">,
    value: string,
  ) {
    setCompletedExercises((current) =>
      current.map((exercise, exerciseIndex) =>
        exerciseIndex === index ? { ...exercise, [field]: value } : exercise,
      ),
    );
  }

  async function saveSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const completedSets = completedExercises.map((exercise, index) => ({
      actualReps: Number(exercise.actualReps),
      actualSets: Number(exercise.actualSets),
      actualWeight: exercise.actualWeight
        ? Number(exercise.actualWeight)
        : null,
      displayOrder: index,
      exerciseName: exercise.exerciseName,
    }));

    if (
      completedSets.some(
        (set) =>
          !Number.isInteger(set.actualReps) ||
          !Number.isInteger(set.actualSets) ||
          set.actualReps < 1 ||
          set.actualSets < 1 ||
          (set.actualWeight !== null &&
            (!Number.isFinite(set.actualWeight) || set.actualWeight < 0)),
      )
    ) {
      setError("Enter whole numbers greater than zero for sets and reps.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/workouts/${routine.id}/sessions`, {
        body: JSON.stringify({ completedSets, notes: notes || null }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        setError(getErrorMessage(payload, "Unable to save this workout."));
        return;
      }

      router.push("/history");
      router.refresh();
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-800 p-5 sm:p-6">
      <h2 className="text-2xl font-semibold text-slate-50">Complete workout</h2>
      <p className="mt-2 text-slate-300">
        Record what you completed today. This saves a permanent snapshot for
        your history.
      </p>
      {completedExercises.length === 0 ? (
        <p className="mt-5 rounded-lg border border-dashed border-slate-600 p-4 text-slate-300">
          Add at least one exercise before logging this workout.
        </p>
      ) : (
        <form className="mt-5 space-y-5" onSubmit={saveSession}>
          <div className="space-y-4">
            {completedExercises.map((exercise, index) => (
              <fieldset
                className="rounded-lg border border-slate-700 p-4"
                key={`${exercise.exerciseName}-${index}`}
              >
                <legend className="px-1 font-semibold text-slate-100">
                  {exercise.exerciseName}
                </legend>
                <div className="mt-2 grid gap-4 sm:grid-cols-3">
                  <NumberInput
                    label="Sets"
                    min={1}
                    onChange={(value) =>
                      updateExercise(index, "actualSets", value)
                    }
                    value={exercise.actualSets}
                  />
                  <NumberInput
                    label="Reps"
                    min={1}
                    onChange={(value) =>
                      updateExercise(index, "actualReps", value)
                    }
                    value={exercise.actualReps}
                  />
                  <NumberInput
                    label="Weight"
                    min={0}
                    onChange={(value) =>
                      updateExercise(index, "actualWeight", value)
                    }
                    step="0.01"
                    value={exercise.actualWeight}
                  />
                </div>
              </fieldset>
            ))}
          </div>
          <div>
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor="session-notes"
            >
              Session notes{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-50 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30"
              id="session-notes"
              maxLength={1000}
              onChange={(event) => setNotes(event.target.value)}
              value={notes}
            />
          </div>
          {error ? (
            <p
              className="rounded-lg border border-red-400/50 bg-red-950/40 p-4 text-sm text-red-200"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          <PrimaryButton aria-busy={isSaving} disabled={isSaving} type="submit">
            {isSaving ? "Saving workout…" : "Save completed workout"}
          </PrimaryButton>
        </form>
      )}
    </section>
  );
}

type NumberInputProps = {
  label: string;
  min: number;
  onChange: (value: string) => void;
  step?: string;
  value: string;
};

function NumberInput({
  label,
  min,
  onChange,
  step = "1",
  value,
}: NumberInputProps) {
  return (
    <label className="text-sm font-medium text-slate-200">
      {label}
      <input
        className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-50 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30"
        inputMode="decimal"
        min={min}
        onChange={(event) => onChange(event.target.value)}
        required={label !== "Weight"}
        step={step}
        type="number"
        value={value}
      />
    </label>
  );
}
