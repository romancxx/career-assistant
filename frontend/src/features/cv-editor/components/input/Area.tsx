interface Props {
  value: string;
  onChange: (v: string) => void;
  rows: number;
}

export function Area({value, onChange, rows}: Props) {
  return (
    <textarea
      className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
      rows={rows}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}
