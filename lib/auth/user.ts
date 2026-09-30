import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";

export type AuthenticatedUser = {
  email: string | null | undefined;
  id: string;
  image: string | null | undefined;
  name: string | null | undefined;
};

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return {
    email: session.user.email,
    id: session.user.id,
    image: session.user.image,
    name: session.user.name,
  };
}

export async function requirePageUser(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
