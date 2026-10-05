import { getAuthenticatedUser } from "@/lib/auth/user";
import { getDashboardSummary } from "@/lib/data/sessions";

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return Response.json(
      { error: "Authentication is required." },
      { status: 401 },
    );
  }

  try {
    return Response.json(await getDashboardSummary(user.id));
  } catch {
    return Response.json(
      { error: "Unable to load the dashboard." },
      { status: 500 },
    );
  }
}
