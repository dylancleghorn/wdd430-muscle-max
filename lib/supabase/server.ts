import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getServerEnvironment } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

export function getSupabaseServerClient() {
  const environment = getServerEnvironment();

  return createClient<Database>(
    environment.SUPABASE_URL,
    environment.SUPABASE_SECRET_KEY,
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    },
  );
}
