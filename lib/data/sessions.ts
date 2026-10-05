import "server-only";

import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type CompletedSetInput = {
  actualReps: number;
  actualSets: number;
  actualWeight: number | null;
  displayOrder: number;
  exerciseName: string;
};

export type WorkoutSession = {
  completedAt: string;
  completedSets: CompletedSetInput[];
  id: string;
  notes: string | null;
  routineId: string | null;
  routineName: string | null;
};

type SessionRow = Database["public"]["Tables"]["workout_sessions"]["Row"];
type CompletedSetRow = Database["public"]["Tables"]["completed_sets"]["Row"];

function throwDataAccessError(): never {
  throw new Error("The workout session data could not be loaded or saved.");
}

function toCompletedSet(row: CompletedSetRow): CompletedSetInput {
  return {
    actualReps: row.actual_reps,
    actualSets: row.actual_sets,
    actualWeight: row.actual_weight,
    displayOrder: row.display_order,
    exerciseName: row.exercise_name,
  };
}

async function getRoutineName(
  userId: string,
  routineId: string | null,
): Promise<string | null> {
  if (!routineId) {
    return null;
  }

  const { data, error } = await getSupabaseServerClient()
    .from("workout_routines")
    .select("name")
    .eq("id", routineId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throwDataAccessError();
  }

  return data?.name ?? null;
}

export async function createWorkoutSession(
  userId: string,
  routineId: string,
  input: { completedSets: CompletedSetInput[]; notes: string | null },
): Promise<WorkoutSession | null> {
  const routineName = await getRoutineName(userId, routineId);

  if (!routineName) {
    return null;
  }

  const client = getSupabaseServerClient();
  const { data: session, error: sessionError } = await client
    .from("workout_sessions")
    .insert({ notes: input.notes, routine_id: routineId, user_id: userId })
    .select("id, user_id, routine_id, completed_at, notes, created_at")
    .single();

  if (sessionError) {
    throwDataAccessError();
  }

  const { data: completedSets, error: setsError } = await client
    .from("completed_sets")
    .insert(
      input.completedSets.map((set) => ({
        actual_reps: set.actualReps,
        actual_sets: set.actualSets,
        actual_weight: set.actualWeight,
        display_order: set.displayOrder,
        exercise_name: set.exerciseName,
        session_id: session.id,
      })),
    )
    .select(
      "id, session_id, exercise_name, actual_sets, actual_reps, actual_weight, display_order",
    );

  if (setsError) {
    await client.from("workout_sessions").delete().eq("id", session.id);
    throwDataAccessError();
  }

  return {
    completedAt: session.completed_at,
    completedSets: completedSets.map(toCompletedSet),
    id: session.id,
    notes: session.notes,
    routineId: session.routine_id,
    routineName,
  };
}

export async function listWorkoutSessions(
  userId: string,
  limit?: number,
): Promise<WorkoutSession[]> {
  let query = getSupabaseServerClient()
    .from("workout_sessions")
    .select("id, user_id, routine_id, completed_at, notes, created_at")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data: sessions, error: sessionsError } = await query;

  if (sessionsError) {
    throwDataAccessError();
  }

  const sessionIds = sessions.map((session) => session.id);
  const { data: completedSets, error: setsError } = sessionIds.length
    ? await getSupabaseServerClient()
        .from("completed_sets")
        .select(
          "id, session_id, exercise_name, actual_sets, actual_reps, actual_weight, display_order",
        )
        .in("session_id", sessionIds)
        .order("display_order", { ascending: true })
    : { data: [], error: null };

  if (setsError) {
    throwDataAccessError();
  }

  const routineIds = Array.from(
    new Set(
      sessions
        .map((session) => session.routine_id)
        .filter((id): id is string => id !== null),
    ),
  );
  const { data: routines, error: routinesError } = routineIds.length
    ? await getSupabaseServerClient()
        .from("workout_routines")
        .select("id, name")
        .eq("user_id", userId)
        .in("id", routineIds)
    : { data: [], error: null };

  if (routinesError) {
    throwDataAccessError();
  }

  const setsBySession = new Map<string, CompletedSetInput[]>();
  for (const set of completedSets) {
    const sets = setsBySession.get(set.session_id) ?? [];
    sets.push(toCompletedSet(set));
    setsBySession.set(set.session_id, sets);
  }
  const routineNames = new Map(
    routines.map((routine) => [routine.id, routine.name]),
  );

  return sessions.map((session: SessionRow) => ({
    completedAt: session.completed_at,
    completedSets: setsBySession.get(session.id) ?? [],
    id: session.id,
    notes: session.notes,
    routineId: session.routine_id,
    routineName: session.routine_id
      ? (routineNames.get(session.routine_id) ?? null)
      : null,
  }));
}

export async function getDashboardSummary(userId: string) {
  const [recentSessions, sessionCount] = await Promise.all([
    listWorkoutSessions(userId, 5),
    getSupabaseServerClient()
      .from("workout_sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  if (sessionCount.error) {
    throwDataAccessError();
  }

  return { recentSessions, totalSessions: sessionCount.count ?? 0 };
}
