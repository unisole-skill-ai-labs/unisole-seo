import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
  helperText?: string;
  className?: string;
  id?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon: Icon,
  helperText,
  className = "",
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
          <span>{label} {props.required && <span className="text-rose-500">*</span>}</span>
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-zinc-400 pointer-events-none flex items-center justify-center">
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 border rounded-lg px-3 py-2 min-h-[40px] transition-colors focus:outline-none focus:border-zinc-400 disabled:bg-zinc-100 disabled:text-zinc-400 dark:disabled:bg-zinc-950 dark:disabled:text-zinc-600 placeholder:text-zinc-400 shadow-xs",
            Icon ? "pl-9" : "",
            error
              ? "border-rose-400 dark:border-rose-800/80 focus:border-rose-500"
              : "border-zinc-200 dark:border-zinc-800"
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{helperText}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;

