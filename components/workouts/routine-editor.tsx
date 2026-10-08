"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

import { PrimaryButton } from "@/components/ui/primary-button";
import { ExerciseForm } from "@/components/workouts/exercise-form";
import type { RoutineExercise } from "@/lib/data/exercises";
import type { WorkoutRoutine } from "@/lib/data/workouts";

type RoutineEditorProps = {
  exercises: RoutineExercise[];
  routine: WorkoutRoutine;
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

function numberValue(formData: FormData, name: string): number | null {
  const value = String(formData.get(name) ?? "").trim();
  if (!value) {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function RoutineEditor({ exercises, routine }: RoutineEditorProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSavingRoutine, setIsSavingRoutine] = useState(false);
  const [isSavingExercise, setIsSavingExercise] = useState(false);
  const [isRefreshing, startRefresh] = useTransition();
  const [exerciseToDelete, setExerciseToDelete] =
    useState<RoutineExercise | null>(null);
  const [isDeletingRoutine, setIsDeletingRoutine] = useState(false);
  const [showRoutineDelete, setShowRoutineDelete] = useState(false);

  function clearMessages() {
    setError(null);
    setNotice(null);
  }

  async function updateRoutine(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim();

    if (!name) {
      setError("Enter a workout name before saving.");
      return;
    }

    clearMessages();
    setIsSavingRoutine(true);

    try {
      const response = await fetch(`/api/workouts/${routine.id}`, {
        body: JSON.stringify({ name, notes: notes || null }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        setError(getErrorMessage(payload, "Unable to save the routine."));
        return;
      }

      setNotice("Routine saved.");
      startRefresh(() => router.refresh());
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsSavingRoutine(false);
    }
  }

  async function deleteRoutine() {
    clearMessages();
    setIsDeletingRoutine(true);

    try {
      const response = await fetch(`/api/workouts/${routine.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const payload: unknown = await response.json();
        setError(getErrorMessage(payload, "Unable to delete the routine."));
        return;
      }

      router.push("/workouts");
      startRefresh(() => router.refresh());
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsDeletingRoutine(false);
      setShowRoutineDelete(false);
    }
  }

  async function createExercise(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const plannedSets = numberValue(formData, "plannedSets");
    const plannedReps = numberValue(formData, "plannedReps");
    const displayOrder = numberValue(formData, "displayOrder");
    const weight = numberValue(formData, "plannedWeight");
    const name = String(formData.get("name") ?? "").trim();

    if (
      !name ||
      plannedSets === null ||
      plannedReps === null ||
      displayOrder === null
    ) {
      setError("Complete every required exercise field with valid numbers.");
      return;
    }

    clearMessages();
    setIsSavingExercise(true);

    try {
      const response = await fetch(`/api/workouts/${routine.id}/exercises`, {
        body: JSON.stringify({
          displayOrder,
          name,
          plannedReps,
          plannedSets,
          plannedWeight: weight,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        setError(getErrorMessage(payload, "Unable to add the exercise."));
        return;
      }

      form.reset();
      setNotice("Exercise added.");
      startRefresh(() => router.refresh());
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsSavingExercise(false);
    }
  }

  async function saveExercise(
    event: FormEvent<HTMLFormElement>,
    exerciseId: string,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const plannedSets = numberValue(formData, "plannedSets");
    const plannedReps = numberValue(formData, "plannedReps");
    const displayOrder = numberValue(formData, "displayOrder");
    const weight = numberValue(formData, "plannedWeight");
    const name = String(formData.get("name") ?? "").trim();

    if (
      !name ||
      plannedSets === null ||
      plannedReps === null ||
      displayOrder === null
    ) {
      setError("Complete every required exercise field with valid numbers.");
      return;
    }

    clearMessages();
    setIsSavingExercise(true);

    try {
      const response = await fetch(
        `/api/workouts/${routine.id}/exercises/${exerciseId}`,
        {
          body: JSON.stringify({
            displayOrder,
            name,
            plannedReps,
            plannedSets,
            plannedWeight: weight,
          }),
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
        },
      );
      const payload: unknown = await response.json();

      if (!response.ok) {
        setError(getErrorMessage(payload, "Unable to save the exercise."));
        return;
      }

      setNotice("Exercise saved.");
      startRefresh(() => router.refresh());
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsSavingExercise(false);
    }
  }

  async function deleteExercise() {
    if (!exerciseToDelete) {
      return;
    }

    clearMessages();
    setIsSavingExercise(true);

    try {
      const response = await fetch(
        `/api/workouts/${routine.id}/exercises/${exerciseToDelete.id}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        const payload: unknown = await response.json();
        setError(getErrorMessage(payload, "Unable to delete the exercise."));
        return;
      }

      setNotice("Exercise removed.");
      startRefresh(() => router.refresh());
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setExerciseToDelete(null);
      setIsSavingExercise(false);
    }
  }

  return (
    <div className="space-y-8">
      <Link
        className="text-sm font-semibold text-green-400 hover:text-green-300"
        href="/workouts"
      >
        ← All routines
      </Link>

      <section className="rounded-xl border border-slate-700 bg-slate-800 p-5 sm:p-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">
          Edit routine
        </h1>
        <form className="mt-5 space-y-4" onSubmit={updateRoutine}>
          <div>
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor="routine-name"
            >
              Routine name
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-50 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30"
              defaultValue={routine.name}
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
              <span className="font-normal text-slate-300">(optional)</span>
            </label>
            <textarea
              className="mt-1 min-h-28 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-50 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30"
              defaultValue={routine.notes ?? ""}
              id="routine-notes"
              maxLength={1000}
              name="notes"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <PrimaryButton
              aria-busy={isSavingRoutine || isRefreshing}
              disabled={isSavingRoutine || isRefreshing}
              type="submit"
            >
              {isSavingRoutine || isRefreshing ? (
                <>
                  <LoadingIndicator />
                  {isRefreshing ? "Updating view…" : "Saving routine…"}
                </>
              ) : (
                "Save routine"
              )}
            </PrimaryButton>
            <button
              className="min-h-11 cursor-pointer rounded-lg border border-red-400/70 px-4 py-2 font-semibold text-red-200 transition hover:bg-red-950/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
              onClick={() => setShowRoutineDelete(true)}
              type="button"
            >
              Delete routine
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-800 p-5 sm:p-6">
        <h2 className="text-2xl font-semibold text-slate-50">
          Add an exercise
        </h2>
        <ExerciseForm
          defaultDisplayOrder={exercises.length}
          idPrefix="new"
          onSubmit={createExercise}
        >
          <div className="sm:col-span-2">
            <PrimaryButton
              aria-busy={isSavingExercise || isRefreshing}
              disabled={isSavingExercise || isRefreshing}
              type="submit"
            >
              {isSavingExercise || isRefreshing ? (
                <>
                  <LoadingIndicator />
                  {isRefreshing ? "Updating list…" : "Adding exercise…"}
                </>
              ) : (
                "Add exercise"
              )}
            </PrimaryButton>
          </div>
        </ExerciseForm>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-50">Exercises</h2>
        {exercises.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-slate-600 px-5 py-6 text-slate-300">
            No exercises yet. Add the first movement for this routine above.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {exercises.map((exercise) => (
              <li
                className="rounded-xl border border-slate-700 bg-slate-800 p-5"
                key={exercise.id}
              >
                <ExerciseForm
                  exercise={exercise}
                  idPrefix={exercise.id}
                  onSubmit={(event) => saveExercise(event, exercise.id)}
                >
                  <div className="flex flex-wrap gap-3 sm:col-span-2">
                    <PrimaryButton
                      aria-busy={isSavingExercise || isRefreshing}
                      disabled={isSavingExercise || isRefreshing}
                      type="submit"
                    >
                      {isSavingExercise || isRefreshing ? (
                        <>
                          <LoadingIndicator />
                          {isRefreshing ? "Updating list…" : "Saving exercise…"}
                        </>
                      ) : (
                        "Save exercise"
                      )}
                    </PrimaryButton>
                    <button
                      className="min-h-11 cursor-pointer rounded-lg border border-red-400/70 px-4 py-2 font-semibold text-red-200 transition hover:bg-red-950/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
                      onClick={() => setExerciseToDelete(exercise)}
                      type="button"
                    >
                      Remove exercise
                    </button>
                  </div>
                </ExerciseForm>
              </li>
            ))}
          </ul>
        )}
      </section>

      {error ? (
        <p
          aria-live="polite"
          className="rounded-lg border border-red-400/50 bg-red-950/40 p-4 text-sm text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      {notice ? (
        <p aria-live="polite" className="text-sm text-green-300">
          {notice}
        </p>
      ) : null}

      {showRoutineDelete ? (
        <ConfirmationDialog
          confirmLabel={isDeletingRoutine ? "Deleting…" : "Delete routine"}
          description="This removes the routine and its exercises. Completed workout history will remain intact."
          onCancel={() => setShowRoutineDelete(false)}
          onConfirm={deleteRoutine}
          title={`Delete ${routine.name}?`}
        />
      ) : null}
      {exerciseToDelete ? (
        <ConfirmationDialog
          confirmLabel={isSavingExercise ? "Removing…" : "Remove exercise"}
          description={`Remove ${exerciseToDelete.name} from this routine?`}
          onCancel={() => setExerciseToDelete(null)}
          onConfirm={deleteExercise}
          title="Remove exercise?"
        />
      ) : null}
    </div>
  );
}

type ConfirmationDialogProps = {
  confirmLabel: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
};

function ConfirmationDialog({
  confirmLabel,
  description,
  onCancel,
  onConfirm,
  title,
}: ConfirmationDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4">
      <section
        aria-describedby="confirmation-description"
        aria-labelledby="confirmation-title"
        aria-modal="true"
        className="w-full max-w-md rounded-xl border border-slate-600 bg-slate-800 p-6 shadow-2xl"
        role="alertdialog"
      >
        <h2
          className="text-xl font-semibold text-slate-50"
          id="confirmation-title"
        >
          {title}
        </h2>
        <p className="mt-2 text-slate-300" id="confirmation-description">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            className="min-h-11 cursor-pointer rounded-lg border border-slate-500 px-4 py-2 font-semibold text-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="min-h-11 cursor-pointer rounded-lg bg-red-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
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
