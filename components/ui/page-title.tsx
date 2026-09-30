import type { ReactNode } from "react";

type PageTitleProps = {
  actions?: ReactNode;
  children: ReactNode;
  description?: string;
};

export function PageTitle({ actions, children, description }: PageTitleProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">
          {children}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-slate-300">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
