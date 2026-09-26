import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface ArrowButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  direction: "prev" | "next";
  /** Screen-reader label, e.g. "Previous testimonials" */
  label: string;
}

/** Round carousel arrow used by every slider on the website. */
export function ArrowButton({ direction, label, type = "button", ...props }: ArrowButtonProps) {
  const Icon = direction === "prev" ? ArrowLeft : ArrowRight;

  return (
    <button
      type={type}
      aria-label={label}
      className="flex size-11.25 items-center justify-center rounded-full border border-zinc-200 bg-white text-brand transition hover:bg-zinc-100 disabled:opacity-40"
      {...props}
    >
      <Icon className="size-5.5" aria-hidden="true" />
    </button>
  );
}

export default ArrowButton;
