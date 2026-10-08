import type { FormEvent, ReactNode } from "react";

import type { RoutineExercise } from "@/lib/data/exercises";

type ExerciseFormProps = {
  children: ReactNode;
  defaultDisplayOrder?: number;
  exercise?: RoutineExercise;
  idPrefix: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ExerciseForm({
  children,
  defaultDisplayOrder = 0,
  exercise,
  idPrefix,
  onSubmit,
}: ExerciseFormProps) {
  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
      <div className="sm:col-span-2">
        <label
          className="text-sm font-medium text-slate-200"
          htmlFor={`${idPrefix}-name`}
        >
          Exercise name
        </label>
        <input
          className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-50 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30"
          defaultValue={exercise?.name}
          id={`${idPrefix}-name`}
          maxLength={100}
          name="name"
          required
        />
      </div>
      <NumberField
        defaultValue={exercise?.plannedSets ?? ""}
        id={`${idPrefix}-sets`}
        label="Planned sets"
        min={1}
        name="plannedSets"
      />
      <NumberField
        defaultValue={exercise?.plannedReps ?? ""}
        id={`${idPrefix}-reps`}
        label="Planned reps"
        min={1}
        name="plannedReps"
      />
      <NumberField
        defaultValue={exercise?.plannedWeight ?? ""}
        id={`${idPrefix}-weight`}
        label="Weight (optional)"
        min={0}
        name="plannedWeight"
        step="0.5"
      />
      <NumberField
        defaultValue={exercise?.displayOrder ?? defaultDisplayOrder}
        id={`${idPrefix}-order`}
        label="Display order"
        min={0}
        name="displayOrder"
      />
      {children}
    </form>
  );
}

type NumberFieldProps = {
  defaultValue: number | string;
  id: string;
  label: string;
  min: number;
  name: string;
  step?: string;
};

function NumberField({
  defaultValue,
  id,
  label,
  min,
  name,
  step = "1",
}: NumberFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-200" htmlFor={id}>
        {label}
      </label>
      <input
        className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-50 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30"
        defaultValue={defaultValue}
        id={id}
        min={min}
        name={name}
        required={name !== "plannedWeight"}
        step={step}
        type="number"
      />
    </div>
  );
}
