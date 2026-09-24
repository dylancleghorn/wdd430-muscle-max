import { getAuthenticatedUser } from "@/lib/auth/user";
import { createWorkoutRoutine, listWorkoutRoutines } from "@/lib/data/workouts";
import { createWorkoutRoutineSchema } from "@/lib/validation/workouts";

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return Response.json(
      { error: "Authentication is required." },
      { status: 401 },
    );
  }

  try {
    const workouts = await listWorkoutRoutines(user.id);
    return Response.json({ workouts });
  } catch {
    return Response.json(
      { error: "Unable to load workout routines." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return Response.json(
      { error: "Authentication is required." },
      { status: 401 },
    );
  }

  const result = createWorkoutRoutineSchema.safeParse(
    await readJsonBody(request),
  );

  if (!result.success) {
    return Response.json(
      {
        error: "The workout routine is invalid.",
        details: result.error.flatten(),
      },
      { status: 422 },
    );
  }

  try {
    const workout = await createWorkoutRoutine(user.id, result.data);
    return Response.json({ workout }, { status: 201 });
  } catch {
    return Response.json(
      { error: "Unable to create the workout routine." },
      { status: 500 },
    );
  }
}
