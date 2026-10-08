import "server-only";

import { getSupabaseServerClient } from "@/lib/supabase/server";

type UpsertUserInput = {
  email: string;
  id: string;
  imageUrl: string | null;
  name: string | null;
};

type ProvisionedUser = {
  id: string;
};

export async function upsertUser({
  email,
  id,
  imageUrl,
  name,
}: UpsertUserInput): Promise<ProvisionedUser> {
  const supabase = getSupabaseServerClient();
  const { data: existingUser, error: lookupError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) {
    throw new Error("Unable to save the signed-in user.");
  }

  const userId = existingUser?.id ?? id;
  const { error } = await supabase.from("users").upsert(
    {
      email,
      id: userId,
      image_url: imageUrl,
      name,
    },
    { onConflict: "id" },
  );

  if (error) {
    throw new Error("Unable to save the signed-in user.");
  }

  return { id: userId };
}
