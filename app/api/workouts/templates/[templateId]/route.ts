import { getAuthenticatedUser } from "@/lib/auth/user";
import { createRoutineExercise } from "@/lib/data/exercises";
import {
  createWorkoutRoutine,
  deleteWorkoutRoutine,
} from "@/lib/data/workouts";
import { getWorkoutTemplate } from "@/lib/workout-templates";

type TemplateRouteProps = {
  params: Promise<{ templateId: string }>;
};

export async function POST(_request: Request, { params }: TemplateRouteProps) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return Response.json(
      { error: "Authentication is required." },
      { status: 401 },
    );
  }

  const { templateId } = await params;
  const template = getWorkoutTemplate(templateId);

  if (!template) {
    return Response.json({ error: "Template not found." }, { status: 404 });
  }

  try {
    const workout = await createWorkoutRoutine(user.id, {
      name: template.name,
      notes: template.description,
    });

    for (const [displayOrder, exercise] of template.exercises.entries()) {
      const createdExercise = await createRoutineExercise(user.id, workout.id, {
        ...exercise,
        displayOrder,
      });

      if (!createdExercise) {
        await deleteWorkoutRoutine(user.id, workout.id);
        return Response.json(
          { error: "Unable to create the workout template." },
          { status: 500 },
        );
      }
    }

    return Response.json({ workout }, { status: 201 });
  } catch {
    return Response.json(
      { error: "Unable to create the workout template." },
      { status: 500 },
    );
  }
}
