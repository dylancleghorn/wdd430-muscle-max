export type WorkoutTemplate = {
  description: string;
  exercises: Array<{
    name: string;
    plannedReps: number;
    plannedSets: number;
    plannedWeight: number | null;
  }>;
  id: string;
  name: string;
};

export const workoutTemplates: WorkoutTemplate[] = [
  {
    description:
      "A balanced, three-movement routine for a simple full-body session.",
    exercises: [
      {
        name: "Goblet squat",
        plannedReps: 10,
        plannedSets: 3,
        plannedWeight: null,
      },
      {
        name: "Dumbbell bench press",
        plannedReps: 10,
        plannedSets: 3,
        plannedWeight: null,
      },
      {
        name: "Seated cable row",
        plannedReps: 12,
        plannedSets: 3,
        plannedWeight: null,
      },
    ],
    id: "full-body-foundation",
    name: "Full-body foundation",
  },
  {
    description: "A push-focused template for chest, shoulders, and triceps.",
    exercises: [
      {
        name: "Barbell bench press",
        plannedReps: 8,
        plannedSets: 4,
        plannedWeight: null,
      },
      {
        name: "Overhead press",
        plannedReps: 10,
        plannedSets: 3,
        plannedWeight: null,
      },
      {
        name: "Triceps pressdown",
        plannedReps: 12,
        plannedSets: 3,
        plannedWeight: null,
      },
    ],
    id: "push-day",
    name: "Push day",
  },
  {
    description:
      "A lower-body strength template that covers squat, hinge, and calves.",
    exercises: [
      {
        name: "Back squat",
        plannedReps: 6,
        plannedSets: 4,
        plannedWeight: null,
      },
      {
        name: "Romanian deadlift",
        plannedReps: 8,
        plannedSets: 3,
        plannedWeight: null,
      },
      {
        name: "Standing calf raise",
        plannedReps: 12,
        plannedSets: 3,
        plannedWeight: null,
      },
    ],
    id: "lower-strength",
    name: "Lower-body strength",
  },
];

export function getWorkoutTemplate(id: string): WorkoutTemplate | null {
  return workoutTemplates.find((template) => template.id === id) ?? null;
}
