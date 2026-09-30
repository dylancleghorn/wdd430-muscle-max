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
