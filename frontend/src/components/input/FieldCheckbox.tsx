import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface FieldCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const FieldCheckbox = forwardRef<HTMLInputElement, FieldCheckboxProps>(
  function FieldCheckbox({ label, className, ...props }, ref) {
    return (
      <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
        <input
          ref={ref}
          type="checkbox"
          className={`h-4 w-4 rounded border-slate-300 accent-slate-700 ${className ?? ""}`}
          {...props}
        />

        <span className="text-xs font-medium text-slate-500">{label}</span>
      </label>
    );
  }
);
