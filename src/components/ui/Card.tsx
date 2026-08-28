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
    default: "minimal-card",
    glass: "bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xs",
    bordered: "bg-transparent border border-zinc-200 dark:border-zinc-800",
    interactive: "minimal-card hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl transition-all duration-150 overflow-hidden",
        variantStyles[variant] || variantStyles.default,
        onClick && variant !== "interactive" && "hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer",
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
    <div className={cn("flex items-center justify-between p-5 pb-2.5 border-b border-zinc-100 dark:border-zinc-800", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...props }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = "", ...props }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed", className)} {...props}>
      {children}
    </div>
  );
}

export default Card;

