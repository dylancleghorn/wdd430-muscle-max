import type { WorkoutSession } from "@/lib/data/sessions";

type SessionListProps = {
  sessions: WorkoutSession[];
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function SessionList({ sessions }: SessionListProps) {
  return (
    <ul className="space-y-4">
      {sessions.map((session) => (
        <li
          className="rounded-xl border border-slate-700 bg-slate-800 p-5"
          key={session.id}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-semibold text-slate-50">
              {session.routineName ?? "Completed workout"}
            </h2>
            <time
              className="text-sm text-slate-300"
              dateTime={session.completedAt}
            >
              {formatDate(session.completedAt)}
            </time>
          </div>
          <ul className="mt-4 space-y-2 text-slate-200">
            {session.completedSets.map((set) => (
              <li
                className="flex flex-wrap justify-between gap-x-4"
                key={`${session.id}-${set.displayOrder}`}
              >
                <span>{set.exerciseName}</span>
                <span className="text-slate-300">
                  {set.actualSets} × {set.actualReps}
                  {set.actualWeight === null ? "" : ` at ${set.actualWeight}`}
                </span>
              </li>
            ))}
          </ul>
          {session.notes ? (
            <p className="mt-4 text-sm text-slate-300">{session.notes}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
