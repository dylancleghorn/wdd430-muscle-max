import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignInButton } from "@/components/auth/sign-in-button";
import { AppFooter } from "@/components/app-footer";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <section className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-xl shadow-slate-950/25 sm:p-8">
          <p className="text-sm font-semibold tracking-[0.2em] text-green-400">
            MUSCLEMAX
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-50">
            Welcome back
          </h1>
          <p className="mt-3 text-slate-300">
            Sign in to create your private workout space. Your first Google
            sign-in creates your account automatically.
          </p>
          <div className="mt-6">
            <SignInButton />
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
