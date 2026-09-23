import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  showIcon?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  className,
  variant = "primary",
  showIcon = true,
  icon,
  type = "button",
  ...props
}: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <button
      type={type}
      className={cn(
        "group inline-flex items-center justify-center gap-3 rounded-full font-semibold text-[15px] transition-all duration-200 cursor-pointer select-none whitespace-nowrap active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        showIcon ? "pl-2 pr-6 py-2" : "px-7 py-3",
        isPrimary
          ? "bg-brand text-white hover:bg-brand-hover shadow-md"
          : "bg-white text-zinc-900 hover:bg-zinc-100 border border-zinc-200 shadow-md",
        className
      )}
      {...props}
    >
      {showIcon && (
        <span
          aria-hidden="true"
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-transform duration-200 group-hover:translate-x-0.5",
            isPrimary
              ? "bg-white text-zinc-900"
              : "bg-zinc-900 text-white"
          )}
        >
          {icon ?? <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
        </span>
      )}
      <span className="leading-none">{children}</span>
    </button>
  );
}

export default Button;
