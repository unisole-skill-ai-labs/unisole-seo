import React from "react";
import { cn } from "../../lib/utils";

export function Table({ className = "", children, ...props }: any) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <table className={cn("w-full text-left text-xs sm:text-sm text-zinc-700 dark:text-zinc-300", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className = "", children, ...props }: any) {
  return (
    <thead className={cn("border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-mono uppercase text-zinc-500", className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ className = "", children, ...props }: any) {
  return (
    <tbody className={cn("divide-y divide-zinc-100 dark:divide-zinc-800/80", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ className = "", children, ...props }: any) {
  return (
    <tr className={cn("transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50", className)} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ className = "", children, ...props }: any) {
  return (
    <th className={cn("px-4 py-3 font-semibold text-zinc-800 dark:text-zinc-200", className)} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ className = "", children, ...props }: any) {
  return (
    <td className={cn("px-4 py-3 text-zinc-600 dark:text-zinc-400", className)} {...props}>
      {children}
    </td>
  );
}
