import React from "react";
import { cn } from "../../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick, ...props }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl border border-slate-200/80 shadow-xs transition-all duration-200",
        onClick && "hover:border-slate-300 hover:shadow-md cursor-pointer",
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
    <div className={cn("flex items-center justify-between p-5 pb-3 border-b border-slate-100", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...props }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-base font-bold text-slate-900", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = "", ...props }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-5 text-sm text-slate-600", className)} {...props}>
      {children}
    </div>
  );
}

export default Card;
