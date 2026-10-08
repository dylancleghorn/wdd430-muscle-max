"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { PrimaryButton } from "@/components/ui/primary-button";
import { TemplateGallery } from "@/components/workouts/template-gallery";
import { WorkoutCard } from "@/components/workouts/workout-card";
import type { WorkoutRoutine } from "@/lib/data/workouts";
import { workoutTemplates } from "@/lib/workout-templates";

type WorkoutListProps = {
  routines: WorkoutRoutine[];
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

function getRoutineId(payload: unknown): string | null {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("workout" in payload)
  ) {
    return null;
  }

  const workout = payload.workout;

  if (
    typeof workout !== "object" ||
    workout === null ||
    !("id" in workout) ||
    typeof workout.id !== "string"
  ) {
    return null;
  }

  return workout.id;
}

export function WorkoutList({ routines }: WorkoutListProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isNavigating, startNavigation] = useTransition();

  async function createRoutine(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim();

    if (!name) {
      setError("Enter a workout name before saving.");
      return;
    }

    setError(null);
    setIsCreating(true);

    try {
      const response = await fetch("/api/workouts", {
        body: JSON.stringify({ name, notes: notes || null }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        setError(getErrorMessage(payload, "Unable to create the routine."));
        return;
      }

      const routineId = getRoutineId(payload);

      if (routineId) {
        startNavigation(() => {
          router.push(`/workouts/${routineId}`);
          router.refresh();
        });
        return;
      }

      setError(
        "The routine was created, but its detail page could not be opened.",
      );
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="space-y-8">
      <TemplateGallery templates={workoutTemplates} />
      <section className="rounded-xl border border-slate-700 bg-slate-800 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-slate-50">
          Create a routine
        </h2>
        <p className="mt-1 text-sm text-slate-300">
          Start with a name, then add exercises from the routine editor.
        </p>
        <form className="mt-5 space-y-4" onSubmit={createRoutine}>
          <div>
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor="routine-name"
            >
              Routine name
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-50 outline-none placeholder:text-slate-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/30"
              id="routine-name"
              maxLength={100}
              name="name"
              required
            />
          </div>
          <div>
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor="routine-notes"
            >
              Notes{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-50 outline-none placeholder:text-slate-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/30"
              id="routine-notes"
              maxLength={1000}
              name="notes"
            />
          </div>
          {error ? (
            <p aria-live="polite" className="text-sm text-red-300" role="alert">
              {error}
            </p>
          ) : null}
          <PrimaryButton
            aria-busy={isCreating || isNavigating}
            disabled={isCreating || isNavigating}
            type="submit"
          >
            {isCreating || isNavigating ? (
              <>
                <LoadingIndicator />
                {isNavigating ? "Opening routine…" : "Creating routine…"}
              </>
            ) : (
              "Create routine"
            )}
          </PrimaryButton>
        </form>
      </section>

      <section>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-semibold text-slate-50">
            Your routines
          </h2>
          <p className="text-sm text-slate-400">{routines.length} total</p>
        </div>
        {routines.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              description="Create your first routine to organize the exercises you plan to do."
              title="No routines yet"
            />
          </div>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {routines.map((routine) => (
              <li key={routine.id}>
                <WorkoutCard routine={routine} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <span
      aria-hidden="true"
      className="mr-2 size-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950"
    />
  );
}
