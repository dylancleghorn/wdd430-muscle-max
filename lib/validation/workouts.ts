import { z } from "zod";

const routineNameSchema = z
  .string()
  .trim()
  .min(1, "A workout name is required.")
  .max(100, "A workout name must be 100 characters or fewer.");

const routineNotesSchema = z
  .string()
  .trim()
  .max(1_000, "Notes must be 1,000 characters or fewer.")
  .transform((value) => value || null);

const exerciseNameSchema = z
  .string()
  .trim()
  .min(1, "An exercise name is required.")
  .max(100, "An exercise name must be 100 characters or fewer.");

const positiveWholeNumberSchema = z
  .number()
  .int("Use a whole number.")
  .min(1, "Use a number greater than zero.");

const optionalWeightSchema = z
  .number()
  .min(0, "Weight cannot be negative.")
  .nullable()
  .optional()
  .default(null);

const displayOrderSchema = z
  .number()
  .int("Display order must be a whole number.")
  .min(0, "Display order cannot be negative.")
  .optional();

export const createWorkoutRoutineSchema = z.object({
  name: routineNameSchema,
  notes: routineNotesSchema.optional().default(null),
});

export const updateWorkoutRoutineSchema = z
  .object({
    name: routineNameSchema.optional(),
    notes: routineNotesSchema.optional(),
  })
  .refine((value) => value.name !== undefined || value.notes !== undefined, {
    message: "Provide a workout name or notes to update the routine.",
  });

export const createRoutineExerciseSchema = z.object({
  displayOrder: displayOrderSchema,
  name: exerciseNameSchema,
  plannedReps: positiveWholeNumberSchema,
  plannedSets: positiveWholeNumberSchema,
  plannedWeight: optionalWeightSchema,
});

export const updateRoutineExerciseSchema = z
  .object({
    displayOrder: displayOrderSchema,
    name: exerciseNameSchema.optional(),
    plannedReps: positiveWholeNumberSchema.optional(),
    plannedSets: positiveWholeNumberSchema.optional(),
    plannedWeight: z
      .number()
      .min(0, "Weight cannot be negative.")
      .nullable()
      .optional(),
  })
  .refine(
    (value) =>
      value.displayOrder !== undefined ||
      value.name !== undefined ||
      value.plannedReps !== undefined ||
      value.plannedSets !== undefined ||
      value.plannedWeight !== undefined,
    { message: "Provide at least one exercise value to update." },
  );

const completedSetSchema = z.object({
  actualReps: positiveWholeNumberSchema,
  actualSets: positiveWholeNumberSchema,
  actualWeight: optionalWeightSchema,
  displayOrder: displayOrderSchema.default(0),
  exerciseName: exerciseNameSchema,
});

export const createWorkoutSessionSchema = z.object({
  completedSets: z
    .array(completedSetSchema)
    .min(1, "Complete at least one exercise before saving a session."),
  notes: routineNotesSchema.optional().default(null),
});
