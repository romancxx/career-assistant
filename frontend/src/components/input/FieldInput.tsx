import {forwardRef} from "react";
import type {InputHTMLAttributes} from "react";

import type {FieldError} from "react-hook-form";

const labelClass = "block text-xs font-medium text-slate-500 mb-1";
const errorClass = "mt-1 text-xs text-red-600";
const controlClass =
  "w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400";

interface FieldInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  required?: boolean;
}

export const FieldInput = forwardRef<HTMLInputElement, FieldInputProps>(
  function FieldInput({label, error, required, className, ...props}, ref) {
    return (
      <div>
        <label className={labelClass}>
          {label}

          {required && <span className="text-red-500"> *</span>}
        </label>

        <input
          ref={ref}
          className={`${controlClass} ${error ? "border-red-400" : "border-slate-300"} ${className ?? ""}`}
          {...props}
        />

        {error?.message && <p className={errorClass}>{error.message}</p>}
      </div>
    );
  },
);
