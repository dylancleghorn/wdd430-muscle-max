import "server-only";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type WorkoutRoutine = {
  createdAt: string;
  id: string;
  name: string;
  notes: string | null;
  updatedAt: string;
};

type RoutineInput = {
  name?: string;
  notes?: string | null;
};

type RoutineRow = Database["public"]["Tables"]["workout_routines"]["Row"];

function toWorkoutRoutine(row: RoutineRow): WorkoutRoutine {
  return {
    createdAt: row.created_at,
    id: row.id,
    name: row.name,
    notes: row.notes,
    updatedAt: row.updated_at,
  };
}

function throwDataAccessError(): never {
  throw new Error("The workout data could not be loaded or saved.");
}

export async function listWorkoutRoutines(
  userId: string,
): Promise<WorkoutRoutine[]> {
  const { data, error } = await getSupabaseServerClient()
    .from("workout_routines")
    .select("id, user_id, name, notes, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throwDataAccessError();
  }

  return data.map(toWorkoutRoutine);
}

export async function createWorkoutRoutine(
  userId: string,
  input: Required<RoutineInput>,
): Promise<WorkoutRoutine> {
  const { data, error } = await getSupabaseServerClient()
    .from("workout_routines")
    .insert({
      name: input.name,
      notes: input.notes,
      user_id: userId,
    })
    .select("id, user_id, name, notes, created_at, updated_at")
    .single();

  if (error) {
    throwDataAccessError();
  }

  return toWorkoutRoutine(data);
}

export async function getWorkoutRoutine(
  userId: string,
  routineId: string,
): Promise<WorkoutRoutine | null> {
  const { data, error } = await getSupabaseServerClient()
    .from("workout_routines")
    .select("id, user_id, name, notes, created_at, updated_at")
    .eq("id", routineId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throwDataAccessError();
  }

  return data ? toWorkoutRoutine(data) : null;
}

export async function updateWorkoutRoutine(
  userId: string,
  routineId: string,
  input: RoutineInput,
): Promise<WorkoutRoutine | null> {
  const { data, error } = await getSupabaseServerClient()
    .from("workout_routines")
    .update(input)
    .eq("id", routineId)
    .eq("user_id", userId)
    .select("id, user_id, name, notes, created_at, updated_at")
    .maybeSingle();

  if (error) {
    throwDataAccessError();
  }

  return data ? toWorkoutRoutine(data) : null;
}

export async function deleteWorkoutRoutine(
  userId: string,
  routineId: string,
): Promise<boolean> {
  const { data, error } = await getSupabaseServerClient()
    .from("workout_routines")
    .delete()
    .eq("id", routineId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    throwDataAccessError();
  }

  return data !== null;
}
