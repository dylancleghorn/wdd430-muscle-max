import { getAuthenticatedUser } from "@/lib/auth/user";
import { createWorkoutSession } from "@/lib/data/sessions";
import { createWorkoutSessionSchema } from "@/lib/validation/workouts";

type SessionRouteContext = {
  params: Promise<{ id: string }>;
};

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function POST(request: Request, context: SessionRouteContext) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return Response.json(
      { error: "Authentication is required." },
      { status: 401 },
    );
  }

  const result = createWorkoutSessionSchema.safeParse(
    await readJsonBody(request),
  );

  if (!result.success) {
    return Response.json(
      {
        error: "The completed workout is invalid.",
        details: result.error.flatten(),
      },
      { status: 422 },
    );
  }

  try {
    const { id } = await context.params;
    const session = await createWorkoutSession(user.id, id, result.data);

    if (!session) {
      return Response.json(
        { error: "Workout routine not found." },
        { status: 404 },
      );
    }

    return Response.json({ session }, { status: 201 });
  } catch {
    return Response.json(
      { error: "Unable to save the completed workout." },
      { status: 500 },
    );
  }
}
