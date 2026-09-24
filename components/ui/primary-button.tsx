import type { ComponentProps } from "react";

type PrimaryButtonProps = ComponentProps<"button">;

export function PrimaryButton({
  className,
  type = "button",
  ...props
}: PrimaryButtonProps) {
  const classes = [
    "inline-flex min-h-11 items-center justify-center rounded-lg bg-green-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 disabled:cursor-not-allowed disabled:opacity-60",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <button className={classes} type={type} {...props} />;
}
