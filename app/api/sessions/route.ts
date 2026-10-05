import { getAuthenticatedUser } from "@/lib/auth/user";
import { listWorkoutSessions } from "@/lib/data/sessions";

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return Response.json(
      { error: "Authentication is required." },
      { status: 401 },
    );
  }

  try {
    const sessions = await listWorkoutSessions(user.id);
    return Response.json({ sessions });
  } catch {
    return Response.json(
      { error: "Unable to load workout history." },
      { status: 500 },
    );
  }
}
