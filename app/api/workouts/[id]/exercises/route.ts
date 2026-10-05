import { getAuthenticatedUser } from "@/lib/auth/user";
import {
  createRoutineExercise,
  listRoutineExercises,
} from "@/lib/data/exercises";
import { createRoutineExerciseSchema } from "@/lib/validation/workouts";

type ExerciseRouteContext = {
  params: Promise<{ id: string }>;
};

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function GET(_request: Request, context: ExerciseRouteContext) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return Response.json(
      { error: "Authentication is required." },
      { status: 401 },
    );
  }

  try {
    const { id } = await context.params;
    const exercises = await listRoutineExercises(user.id, id);

    if (!exercises) {
      return Response.json(
        { error: "Workout routine not found." },
        { status: 404 },
      );
    }

    return Response.json({ exercises });
  } catch {
    return Response.json(
      { error: "Unable to load exercises." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, context: ExerciseRouteContext) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return Response.json(
      { error: "Authentication is required." },
      { status: 401 },
    );
  }

  const result = createRoutineExerciseSchema.safeParse(
    await readJsonBody(request),
  );

  if (!result.success) {
    return Response.json(
      { error: "The exercise is invalid.", details: result.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const { id } = await context.params;
    const exercise = await createRoutineExercise(user.id, id, {
      ...result.data,
      displayOrder: result.data.displayOrder ?? 0,
    });

    if (!exercise) {
      return Response.json(
        { error: "Workout routine not found." },
        { status: 404 },
      );
    }

    return Response.json({ exercise }, { status: 201 });
  } catch {
    return Response.json(
      { error: "Unable to create the exercise." },
      { status: 500 },
    );
  }
}
