import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="border-t border-slate-800 px-4 py-6 text-center text-sm text-slate-400">
      <p>MuscleMAX helps you plan workouts and track your consistency.</p>
      <nav aria-label="Legal" className="mt-2 flex justify-center gap-4">
        <Link className="hover:text-slate-200" href="/privacy">
          Privacy Policy
        </Link>
        <Link className="hover:text-slate-200" href="/terms">
          Terms of Service
        </Link>
      </nav>
    </footer>
  );
}
