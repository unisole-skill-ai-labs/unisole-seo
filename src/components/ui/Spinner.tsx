import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export default function Spinner({
  size = "md",
  className = "",
  label = "Loading...",
}: SpinnerProps) {
  const sizeStyles = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-8 h-8",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-6 text-zinc-500", className)}>
      <Loader2 className={cn("animate-spin text-zinc-900 dark:text-zinc-100", sizeStyles[size] || sizeStyles.md)} />
      {label && <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{label}</p>}
    </div>
  );
}
