import React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "brand" | "emerald" | "amber" | "rose" | "cyan" | "violet" | "glass";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] rounded-md tracking-wider uppercase font-bold",
    md: "px-2.5 py-1 text-xs rounded-lg font-bold",
    lg: "px-3.5 py-1.5 text-sm rounded-xl font-bold",
  };

  const variantStyles = {
    default: "bg-slate-100 text-slate-800 border border-slate-200/60 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700/60",
    brand: "bg-indigo-50 text-indigo-700 border border-indigo-200/70 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-800/60",
    violet: "bg-violet-50 text-violet-700 border border-violet-200/70 dark:bg-violet-950/50 dark:text-violet-400 dark:border-violet-800/60",
    cyan: "bg-cyan-50 text-cyan-700 border border-cyan-200/70 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-800/60",
    emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200/70 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/60",
    amber: "bg-amber-50 text-amber-700 border border-amber-200/70 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800/60",
    rose: "bg-rose-50 text-rose-700 border border-rose-200/70 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800/60",
    glass: "bg-white/20 text-white border border-white/25 backdrop-blur-md",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 transition-colors",
        sizeStyles[size] || sizeStyles.md,
        variantStyles[variant] || variantStyles.default,
        className
      )}
    >
      {children}
    </span>
  );
}

