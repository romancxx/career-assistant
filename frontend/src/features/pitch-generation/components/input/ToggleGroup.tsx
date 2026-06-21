interface Props<T extends string> {
  label: string;
  options: Record<T, string>;
  value: T;
  onChange: (value: T) => void;
}

export function ToggleGroup<T extends string>(props: Props<T>) {
  const {label, options, value, onChange} = props;
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
        {label}
      </label>

      <div className="flex gap-2">
        {(Object.keys(options) as T[]).map(option => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium border ${
              value === option
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
            }`}
          >
            {options[option]}
          </button>
        ))}
      </div>
    </div>
  );
}
