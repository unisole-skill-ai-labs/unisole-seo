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
    "inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none cursor-pointer";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5 min-h-[36px]",
    md: "px-4.5 py-2.5 text-xs sm:text-sm gap-2 min-h-[42px]",
    lg: "px-6 py-3 text-sm sm:text-base gap-2.5 min-h-[48px]",
    icon: "p-2.5 min-h-[40px] min-w-[40px] rounded-xl",
  };

  const variantStyles = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-md shadow-indigo-600/20 focus-visible:ring-indigo-500",
    brand:
      "bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white shadow-lg shadow-indigo-600/25 focus-visible:ring-indigo-500 border border-indigo-400/20",
    glow:
      "bg-indigo-600 hover:bg-indigo-700 text-white shadow-glow-primary hover:shadow-indigo-500/40 focus-visible:ring-indigo-400",
    secondary:
      "bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-900 border border-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 dark:border-slate-700/60 focus-visible:ring-slate-400",
    outline:
      "border border-slate-200/90 hover:border-indigo-400 hover:bg-indigo-50/50 bg-white/50 dark:bg-slate-900/50 text-slate-700 hover:text-indigo-600 dark:border-slate-800 dark:hover:border-indigo-500/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-indigo-950/30 focus-visible:ring-indigo-400",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 dark:hover:bg-slate-800/60 dark:text-slate-400 dark:hover:text-white focus-visible:ring-slate-300",
    glass:
      "border border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md focus-visible:ring-white/40 shadow-sm",
    white:
      "bg-white hover:bg-slate-50 text-slate-900 font-extrabold border border-slate-200 shadow-sm focus-visible:ring-slate-300",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus-visible:ring-rose-500",
    success:
      "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus-visible:ring-emerald-500",
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

