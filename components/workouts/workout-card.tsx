import Link from "next/link";

import type { WorkoutRoutine } from "@/lib/data/workouts";

type WorkoutCardProps = {
  routine: WorkoutRoutine;
};

export function WorkoutCard({ routine }: WorkoutCardProps) {
  return (
    <Link
      className="block h-full rounded-xl border border-slate-700 bg-slate-800 p-5 transition hover:border-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
      href={`/workouts/${routine.id}`}
    >
      <h3 className="text-lg font-semibold text-slate-50">{routine.name}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-slate-300">
        {routine.notes || "No notes yet."}
      </p>
      <span className="mt-5 inline-block text-sm font-semibold text-green-400">
        Edit routine →
      </span>
    </Link>
  );
}
