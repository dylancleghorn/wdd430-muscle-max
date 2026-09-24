import { getAuthenticatedUser } from "@/lib/auth/user";
import {
  deleteWorkoutRoutine,
  getWorkoutRoutine,
  updateWorkoutRoutine,
} from "@/lib/data/workouts";
import { updateWorkoutRoutineSchema } from "@/lib/validation/workouts";

type WorkoutRouteContext = {
  params: Promise<{ id: string }>;
};

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function getRouteUser() {
  return getAuthenticatedUser();
}

export async function GET(_request: Request, context: WorkoutRouteContext) {
  const user = await getRouteUser();

  if (!user) {
    return Response.json(
      { error: "Authentication is required." },
      { status: 401 },
    );
  }

  try {
    const { id } = await context.params;
    const workout = await getWorkoutRoutine(user.id, id);

    if (!workout) {
      return Response.json(
        { error: "Workout routine not found." },
        { status: 404 },
      );
    }

    return Response.json({ workout });
  } catch {
    return Response.json(
      { error: "Unable to load the workout routine." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: WorkoutRouteContext) {
  const user = await getRouteUser();

  if (!user) {
    return Response.json(
      { error: "Authentication is required." },
      { status: 401 },
    );
  }

  const result = updateWorkoutRoutineSchema.safeParse(
    await readJsonBody(request),
  );

  if (!result.success) {
    return Response.json(
      {
        error: "The workout routine update is invalid.",
        details: result.error.flatten(),
      },
      { status: 422 },
    );
  }

  try {
    const { id } = await context.params;
    const workout = await updateWorkoutRoutine(user.id, id, result.data);

    if (!workout) {
      return Response.json(
        { error: "Workout routine not found." },
        { status: 404 },
      );
    }

    return Response.json({ workout });
  } catch {
    return Response.json(
      { error: "Unable to update the workout routine." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: WorkoutRouteContext) {
  const user = await getRouteUser();

  if (!user) {
    return Response.json(
      { error: "Authentication is required." },
      { status: 401 },
    );
  }

  try {
    const { id } = await context.params;
    const deleted = await deleteWorkoutRoutine(user.id, id);

    if (!deleted) {
      return Response.json(
        { error: "Workout routine not found." },
        { status: 404 },
      );
    }

    return new Response(null, { status: 204 });
  } catch {
    return Response.json(
      { error: "Unable to delete the workout routine." },
      { status: 500 },
    );
  }
}
