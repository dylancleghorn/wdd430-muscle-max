"use client";

import { useEffect, useState } from "react";

const presets = [60, 90, 120];

function formatRemaining(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function RestTimer() {
  const [duration, setDuration] = useState(90);
  const [remaining, setRemaining] = useState(90);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || remaining === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setRemaining((current) => current - 1);
    }, 1_000);

    return () => window.clearInterval(timer);
  }, [isRunning, remaining]);

  function choosePreset(seconds: number) {
    setDuration(seconds);
    setRemaining(seconds);
    setIsRunning(false);
  }

  function toggleTimer() {
    if (remaining === 0) {
      setRemaining(duration);
      setIsRunning(true);
      return;
    }
    setIsRunning((current) => !current);
  }

  return (
    <section
      aria-label="Rest timer"
      className="mt-5 rounded-lg border border-green-400/30 bg-slate-950/40 p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-green-300">Rest timer</p>
          <p
            aria-live="polite"
            className="mt-1 text-3xl font-bold tabular-nums text-slate-50"
          >
            {formatRemaining(remaining)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((seconds) => (
            <button
              className="min-h-10 cursor-pointer rounded-md border border-slate-600 px-3 text-sm font-medium text-slate-200 hover:border-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
              key={seconds}
              onClick={() => choosePreset(seconds)}
              type="button"
            >
              {seconds / 60} min
            </button>
          ))}
          <button
            className="min-h-10 cursor-pointer rounded-md bg-green-400 px-3 text-sm font-semibold text-slate-950 hover:bg-green-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
            onClick={toggleTimer}
            type="button"
          >
            {isRunning && remaining > 0
              ? "Pause"
              : remaining === 0
                ? "Restart"
                : "Start"}
          </button>
          <button
            className="min-h-10 cursor-pointer rounded-md border border-slate-600 px-3 text-sm font-medium text-slate-200 hover:border-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
            onClick={() => {
              setRemaining(duration);
              setIsRunning(false);
            }}
            type="button"
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}
