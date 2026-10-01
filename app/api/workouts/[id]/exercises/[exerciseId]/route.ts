import { getAuthenticatedUser } from "@/lib/auth/user";
import {
  deleteRoutineExercise,
  updateRoutineExercise,
} from "@/lib/data/exercises";
import { updateRoutineExerciseSchema } from "@/lib/validation/workouts";

type ExerciseRouteContext = {
  params: Promise<{ exerciseId: string; id: string }>;
};

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function PATCH(request: Request, context: ExerciseRouteContext) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return Response.json(
      { error: "Authentication is required." },
      { status: 401 },
    );
  }

  const result = updateRoutineExerciseSchema.safeParse(
    await readJsonBody(request),
  );

  if (!result.success) {
    return Response.json(
      {
        error: "The exercise update is invalid.",
        details: result.error.flatten(),
      },
      { status: 422 },
    );
  }

  try {
    const { exerciseId, id } = await context.params;
    const exercise = await updateRoutineExercise(
      user.id,
      id,
      exerciseId,
      result.data,
    );

    if (!exercise) {
      return Response.json(
        { error: "Exercise or workout routine not found." },
        { status: 404 },
      );
    }

    return Response.json({ exercise });
  } catch {
    return Response.json(
      { error: "Unable to update the exercise." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: ExerciseRouteContext) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return Response.json(
      { error: "Authentication is required." },
      { status: 401 },
    );
  }

  try {
    const { exerciseId, id } = await context.params;
    const deleted = await deleteRoutineExercise(user.id, id, exerciseId);

    if (!deleted) {
      return Response.json(
        { error: "Exercise or workout routine not found." },
        { status: 404 },
      );
    }

    return new Response(null, { status: 204 });
  } catch {
    return Response.json(
      { error: "Unable to delete the exercise." },
      { status: 500 },
    );
  }
}
