import React from "react";
import { cn } from "../../lib/utils";

export default function PageHeader({
  title,
  subtitle,
  children,
  badge,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-5 border-b border-zinc-200 dark:border-zinc-800", className)}>
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2 flex-wrap">{children}</div>}
    </div>
  );
}
