import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ComponentProps<"button"> {
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
        "group inline-flex items-center justify-center gap-3 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer select-none whitespace-nowrap active:scale-98 disabled:pointer-events-none disabled:opacity-50",
        showIcon ? "pl-1.5 pr-4 py-1.5" : "px-7 py-3",
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
            "relative flex items-center justify-center w-8 h-8 rounded-full shrink-0 overflow-hidden",
            isPrimary
              ? "bg-white text-brand"
              : "bg-brand text-white"
          )}
        >
          {icon ?? (
            <>
              {/* On hover the arrow slides out right while a copy slides in from the left */}
              <ArrowRight strokeWidth={2.5} className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-6 motion-reduce:transition-none" />
              <ArrowRight strokeWidth={2.5} className="absolute size-4 -translate-x-6 transition-transform duration-300 ease-out group-hover:translate-x-0 motion-reduce:transition-none" />
            </>
          )}
        </span>
      )}
      <span className="leading-none">{children}</span>
    </button>
  );
}

export default Button;
