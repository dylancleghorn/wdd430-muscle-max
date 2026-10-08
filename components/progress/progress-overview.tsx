import type { ExerciseProgress } from "@/lib/data/progress";

type ProgressOverviewProps = {
  exercises: ExerciseProgress[];
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

function recordLabel(record: ExerciseProgress["record"]): string {
  if (record.weight === null) {
    return `${record.reps} reps`;
  }

  return `${record.weight} × ${record.reps}`;
}

function TrendChart({ exercise }: { exercise: ExerciseProgress }) {
  const points = exercise.points;
  const values = points.map((point) => point.estimatedOneRepMax);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const span = maximum - minimum || 1;
  const width = 320;
  const height = 144;
  const padding = 18;
  const coordinates = points.map((point, index) => {
    const x =
      points.length === 1
        ? width / 2
        : padding + (index * (width - padding * 2)) / (points.length - 1);
    const y =
      height -
      padding -
      ((point.estimatedOneRepMax - minimum) / span) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <article className="rounded-xl border border-slate-700 bg-slate-800 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-50">
          {exercise.exerciseName}
        </h2>
        <p className="text-sm text-green-300">Estimated 1RM</p>
      </div>
      <svg
        aria-label={`${exercise.exerciseName} estimated one-rep-max trend`}
        className="mt-4 h-40 w-full overflow-visible"
        role="img"
        viewBox={`0 0 ${width} ${height}`}
      >
        <line
          stroke="#475569"
          strokeDasharray="4 4"
          x1={padding}
          x2={width - padding}
          y1={height / 2}
          y2={height / 2}
        />
        <polyline
          fill="none"
          points={coordinates.join(" ")}
          stroke="#4ade80"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        {coordinates.map((coordinate, index) => {
          const [cx, cy] = coordinate.split(",");
          return (
            <circle
              cx={cx}
              cy={cy}
              fill="#4ade80"
              key={points[index].completedAt}
              r="4"
            />
          );
        })}
      </svg>
      <div className="flex justify-between text-xs text-slate-400">
        <span>{formatDate(points[0].completedAt)}</span>
        <span>
          {formatDate(points.at(-1)?.completedAt ?? points[0].completedAt)}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-300">
        Latest estimate: {points.at(-1)?.estimatedOneRepMax} · Best: {maximum}
      </p>
    </article>
  );
}

export function ProgressOverview({ exercises }: ProgressOverviewProps) {
  const chartExercises = exercises
    .filter((exercise) => exercise.points.length > 0)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold text-slate-50">
          Personal records
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.map((exercise) => (
            <li
              className="rounded-xl border border-slate-700 bg-slate-800 p-5"
              key={exercise.exerciseName}
            >
              <p className="font-semibold text-slate-100">
                {exercise.exerciseName}
              </p>
              <p className="mt-2 text-2xl font-bold text-green-400">
                {recordLabel(exercise.record)}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Set {formatDate(exercise.record.completedAt)}
              </p>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-slate-50">
          Progress charts
        </h2>
        <p className="mt-1 text-slate-300">
          Your latest eight weighted sets, using an estimated one-rep max to
          make different rep ranges comparable.
        </p>
        {chartExercises.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-slate-600 p-5 text-slate-300">
            Log a weight with a completed workout to start charting strength
            progress.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {chartExercises.map((exercise) => (
              <TrendChart exercise={exercise} key={exercise.exerciseName} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
