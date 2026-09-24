import "server-only";

import { getSupabaseServerClient } from "@/lib/supabase/server";

type UpsertUserInput = {
  email: string;
  id: string;
  imageUrl: string | null;
  name: string | null;
};

export async function upsertUser({
  email,
  id,
  imageUrl,
  name,
}: UpsertUserInput): Promise<void> {
  const { error } = await getSupabaseServerClient().from("users").upsert(
    {
      email,
      id,
      image_url: imageUrl,
      name,
    },
    { onConflict: "id" },
  );

  if (error) {
    throw new Error("Unable to save the signed-in user.");
  }
}
