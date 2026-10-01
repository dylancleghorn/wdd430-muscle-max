import "server-only";

import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type RoutineExercise = {
  displayOrder: number;
  id: string;
  name: string;
  plannedReps: number;
  plannedSets: number;
  plannedWeight: number | null;
};

type ExerciseInput = {
  displayOrder?: number;
  name?: string;
  plannedReps?: number;
  plannedSets?: number;
  plannedWeight?: number | null;
};

type ExerciseRow = Database["public"]["Tables"]["routine_exercises"]["Row"];

function toRoutineExercise(row: ExerciseRow): RoutineExercise {
  return {
    displayOrder: row.display_order,
    id: row.id,
    name: row.name,
    plannedReps: row.planned_reps,
    plannedSets: row.planned_sets,
    plannedWeight: row.planned_weight,
  };
}

function throwDataAccessError(): never {
  throw new Error("The exercise data could not be loaded or saved.");
}

async function hasRoutineAccess(
  userId: string,
  routineId: string,
): Promise<boolean> {
  const { data, error } = await getSupabaseServerClient()
    .from("workout_routines")
    .select("id")
    .eq("id", routineId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throwDataAccessError();
  }

  return data !== null;
}

export async function listRoutineExercises(
  userId: string,
  routineId: string,
): Promise<RoutineExercise[] | null> {
  if (!(await hasRoutineAccess(userId, routineId))) {
    return null;
  }

  const { data, error } = await getSupabaseServerClient()
    .from("routine_exercises")
    .select(
      "id, routine_id, name, planned_sets, planned_reps, planned_weight, display_order, created_at, updated_at",
    )
    .eq("routine_id", routineId)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throwDataAccessError();
  }

  return data.map(toRoutineExercise);
}

export async function createRoutineExercise(
  userId: string,
  routineId: string,
  input: Required<ExerciseInput>,
): Promise<RoutineExercise | null> {
  if (!(await hasRoutineAccess(userId, routineId))) {
    return null;
  }

  const { data, error } = await getSupabaseServerClient()
    .from("routine_exercises")
    .insert({
      display_order: input.displayOrder,
      name: input.name,
      planned_reps: input.plannedReps,
      planned_sets: input.plannedSets,
      planned_weight: input.plannedWeight,
      routine_id: routineId,
    })
    .select(
      "id, routine_id, name, planned_sets, planned_reps, planned_weight, display_order, created_at, updated_at",
    )
    .single();

  if (error) {
    throwDataAccessError();
  }

  return toRoutineExercise(data);
}

export async function updateRoutineExercise(
  userId: string,
  routineId: string,
  exerciseId: string,
  input: ExerciseInput,
): Promise<RoutineExercise | null> {
  if (!(await hasRoutineAccess(userId, routineId))) {
    return null;
  }

  const update = {
    ...(input.displayOrder !== undefined
      ? { display_order: input.displayOrder }
      : {}),
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.plannedReps !== undefined
      ? { planned_reps: input.plannedReps }
      : {}),
    ...(input.plannedSets !== undefined
      ? { planned_sets: input.plannedSets }
      : {}),
    ...(input.plannedWeight !== undefined
      ? { planned_weight: input.plannedWeight }
      : {}),
  };

  const { data, error } = await getSupabaseServerClient()
    .from("routine_exercises")
    .update(update)
    .eq("id", exerciseId)
    .eq("routine_id", routineId)
    .select(
      "id, routine_id, name, planned_sets, planned_reps, planned_weight, display_order, created_at, updated_at",
    )
    .maybeSingle();

  if (error) {
    throwDataAccessError();
  }

  return data ? toRoutineExercise(data) : null;
}

export async function deleteRoutineExercise(
  userId: string,
  routineId: string,
  exerciseId: string,
): Promise<boolean | null> {
  if (!(await hasRoutineAccess(userId, routineId))) {
    return null;
  }

  const { data, error } = await getSupabaseServerClient()
    .from("routine_exercises")
    .delete()
    .eq("id", exerciseId)
    .eq("routine_id", routineId)
    .select("id")
    .maybeSingle();

  if (error) {
    throwDataAccessError();
  }

  return data !== null;
}
