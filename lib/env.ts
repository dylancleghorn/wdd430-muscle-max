import "server-only";

import { z } from "zod";

const serverEnvironmentSchema = z.object({
  AUTH_GOOGLE_ID: z.string().min(1),
  AUTH_GOOGLE_SECRET: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_SECRET_KEY: z.string().min(1),
  SUPABASE_URL: z.url(),
});

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;

export function getServerEnvironment(): ServerEnvironment {
  const result = serverEnvironmentSchema.safeParse({
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    AUTH_SECRET: process.env.AUTH_SECRET,
    SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
  });

  if (!result.success) {
    const missingNames = Object.keys(result.error.flatten().fieldErrors).join(
      ", ",
    );
    throw new Error(
      `Missing or invalid server environment variables: ${missingNames}.`,
    );
  }

  return result.data;
}
