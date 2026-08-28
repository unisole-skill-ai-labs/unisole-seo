import React from "react";
import { FolderOpen } from "lucide-react";
import Button from "../ui/Button";
import { cn } from "../../lib/utils";

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = "No items found",
  description = "There are no records to display at this time.",
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-10 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30", className)}>
      <div className="p-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-400 mb-3">
        <Icon className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
      </div>
      <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">{title}</h4>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-3.5">
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
