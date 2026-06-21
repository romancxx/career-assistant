interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

export function Field({label, value, onChange}: Props) {
  return (
    <label className="block text-sm flex-1">
      <span className="text-xs font-medium text-slate-500">{label}</span>

      <input
        className="mt-1 w-full border border-slate-300 rounded px-2 py-1"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </label>
  );
}
