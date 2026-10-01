import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignInButton } from "@/components/auth/sign-in-button";
import { AppFooter } from "@/components/app-footer";

export default async function Home() {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-800 p-8 shadow-2xl shadow-slate-950/30 sm:p-12">
          <p className="text-sm font-semibold tracking-[0.2em] text-green-400">
            MUSCLEMAX
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
            Build workouts you will actually come back to.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Keep your routines, gym sessions, and consistency in one private
            place.
          </p>
          <div className="mt-8 max-w-xs">
            <SignInButton />
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
