import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { PageTitle } from "@/components/ui/page-title";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageTitle description="Your recent activity and workout consistency will appear here.">
        Dashboard
      </PageTitle>
      <EmptyState
        action={
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-green-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
            href="/workouts"
          >
            Create a routine
          </Link>
        }
        description="Workout routines and completed sessions will show here as you build them."
        title="Your training space is ready"
      />
    </div>
  );
}
