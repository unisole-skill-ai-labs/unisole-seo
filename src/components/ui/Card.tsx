import React from "react";
import { cn } from "../../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "bordered" | "interactive";
  onClick?: () => void;
}

export function Card({
  children,
  className = "",
  variant = "default",
  onClick,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 shadow-xs",
    glass: "glass-card shadow-sm",
    bordered: "bg-transparent border border-slate-200 dark:border-slate-800",
    interactive: "bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 hover:shadow-card-hover dark:hover:shadow-dark-card-hover hover:-translate-y-1 cursor-pointer",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl transition-all duration-300 ease-out overflow-hidden",
        variantStyles[variant] || variantStyles.default,
        onClick && variant !== "interactive" && "hover:border-indigo-500/40 hover:shadow-md cursor-pointer hover:-translate-y-[2px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between p-6 pb-3 border-b border-slate-100 dark:border-slate-800/40", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...props }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = "", ...props }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed", className)} {...props}>
      {children}
    </div>
  );
}

export default Card;

