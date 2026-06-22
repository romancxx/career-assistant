import { forwardRef } from "react";
import type { ReactNode, SelectHTMLAttributes } from "react";

import type { FieldError } from "react-hook-form";

const labelClass = "block text-xs font-medium text-slate-500 mb-1";
const errorClass = "mt-1 text-xs text-red-600";
const controlClass =
  "w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400";

interface FieldSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: FieldError;
  children: ReactNode;
}

export const FieldSelect = forwardRef<HTMLSelectElement, FieldSelectProps>(function FieldSelect(
  { label, error, className, children, ...props },
  ref
) {
  return (
    <div>
      <label className={labelClass}>{label}</label>

      <select
        ref={ref}
        className={`${controlClass} ${error ? "border-red-400" : "border-slate-300"} ${className ?? ""}`}
        {...props}
      >
        {children}
      </select>

      {error?.message && <p className={errorClass}>{error.message}</p>}
    </div>
  );
});
