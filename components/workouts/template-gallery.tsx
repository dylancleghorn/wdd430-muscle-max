"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { WorkoutTemplate } from "@/lib/workout-templates";

type TemplateGalleryProps = {
  templates: WorkoutTemplate[];
};

type CreatedWorkout = { workout?: { id?: string } };

export function TemplateGallery({ templates }: TemplateGalleryProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [creatingId, setCreatingId] = useState<string | null>(null);

  async function createFromTemplate(template: WorkoutTemplate) {
    setError(null);
    setCreatingId(template.id);

    try {
      const response = await fetch(`/api/workouts/templates/${template.id}`, {
        method: "POST",
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        setError("Unable to create that template. Please try again.");
        return;
      }

      const workoutId = (payload as CreatedWorkout).workout?.id;
      if (!workoutId) {
        setError("The template was created, but could not be opened.");
        return;
      }

      router.push(`/workouts/${workoutId}`);
      router.refresh();
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setCreatingId(null);
    }
  }

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-800 p-5 sm:p-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-50">
          Start from a template
        </h2>
        <p className="mt-1 text-sm text-slate-300">
          Add a ready-to-edit routine with its exercises already included.
        </p>
      </div>
      <ul className="mt-5 grid gap-4 lg:grid-cols-3">
        {templates.map((template) => (
          <li
            className="rounded-lg border border-slate-700 bg-slate-950/40 p-4"
            key={template.id}
          >
            <h3 className="font-semibold text-slate-100">{template.name}</h3>
            <p className="mt-1 text-sm text-slate-400">
              {template.description}
            </p>
            <p className="mt-3 text-sm text-slate-300">
              {template.exercises.map((exercise) => exercise.name).join(" · ")}
            </p>
            <button
              className="mt-4 min-h-11 cursor-pointer rounded-lg border border-green-400 px-4 py-2 text-sm font-semibold text-green-300 transition hover:bg-green-400 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 disabled:cursor-wait disabled:opacity-70"
              disabled={creatingId !== null}
              onClick={() => createFromTemplate(template)}
              type="button"
            >
              {creatingId === template.id ? "Creating…" : "Use template"}
            </button>
          </li>
        ))}
      </ul>
      {error ? (
        <p className="mt-4 text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
