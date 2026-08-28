import React, { createContext, useContext, useState } from "react";
import { cn } from "../../lib/utils";

interface TabsContextValue {
  activeValue?: string;
  changeValue: (val: string) => void;
}

const TabsContext = createContext<TabsContextValue>({
  activeValue: undefined,
  changeValue: () => {},
});

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, value, onValueChange, children, className = "" }: TabsProps) {
  const [selected, setSelected] = useState(defaultValue);
  const activeValue = value !== undefined ? value : selected;
  const changeValue = onValueChange || setSelected;

  return (
    <TabsContext.Provider value={{ activeValue, changeValue }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5 p-1.5 bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-x-auto no-scrollbar max-w-full", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className = "" }: { value: string; children: React.ReactNode; className?: string }) {
  const { activeValue, changeValue } = useContext(TabsContext);
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      onClick={() => changeValue(value)}
      className={cn(
        "px-4 py-2 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-200 ease-out select-none flex-shrink-0 cursor-pointer min-h-[38px]",
        isActive
          ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60"
          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/40 dark:hover:bg-slate-800/40",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = "" }: { value: string; children: React.ReactNode; className?: string }) {
  const { activeValue } = useContext(TabsContext);
  if (activeValue !== value) return null;

  return <div className={cn("mt-4 animate-in fade-in duration-200", className)}>{children}</div>;
}

