import type { ReactNode } from "react";

import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { requirePageUser } from "@/lib/auth/user";

export default async function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requirePageUser();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppHeader userName={user.name} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
