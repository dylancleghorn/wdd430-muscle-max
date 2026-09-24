import type { ReactNode } from "react";

type EmptyStateProps = {
  action?: ReactNode;
  description: string;
  title: string;
};

export function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-800 p-6 text-center">
      <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-slate-300">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </section>
  );
}
