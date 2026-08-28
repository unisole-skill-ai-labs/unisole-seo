import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glass" | "white" | "danger" | "success" | "brand" | "glow";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  iconPosition?: "left" | "right";
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold tracking-normal rounded-lg transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none cursor-pointer";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5 min-h-[36px]",
    md: "px-4 py-2 text-xs sm:text-sm gap-2 min-h-[40px]",
    lg: "px-5 py-2.5 text-sm sm:text-base gap-2.5 min-h-[44px]",
    icon: "p-2 min-h-[36px] min-w-[36px] rounded-lg",
  };

  const variantStyles = {
    primary:
      "bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:active:bg-zinc-200 shadow-xs focus-visible:ring-zinc-500",
    brand:
      "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 shadow-xs focus-visible:ring-zinc-500",
    glow:
      "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 shadow-xs focus-visible:ring-zinc-400",
    secondary:
      "bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-900 border border-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 dark:border-zinc-700 focus-visible:ring-zinc-400",
    outline:
      "border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 bg-white dark:bg-zinc-900 text-zinc-800 dark:border-zinc-800 dark:hover:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-850 focus-visible:ring-zinc-400",
    ghost:
      "bg-transparent hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white focus-visible:ring-zinc-300",
    glass:
      "border border-zinc-200/50 bg-white/70 hover:bg-white/90 text-zinc-900 dark:border-zinc-800/60 dark:bg-zinc-900/70 dark:text-white backdrop-blur-xs focus-visible:ring-zinc-400",
    white:
      "bg-white hover:bg-zinc-50 text-zinc-900 font-semibold border border-zinc-200 shadow-xs focus-visible:ring-zinc-300",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus-visible:ring-rose-500",
    success:
      "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs focus-visible:ring-emerald-500",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        sizeStyles[size] || sizeStyles.md,
        variantStyles[variant] || variantStyles.primary,
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          {children && <span>{children}</span>}
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className="w-4 h-4 flex-shrink-0" />}
          {children}
          {Icon && iconPosition === "right" && <Icon className="w-4 h-4 flex-shrink-0" />}
        </>
      )}
    </button>
  );
}

