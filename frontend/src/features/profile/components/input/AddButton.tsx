interface Props {
  label: string;
  onClick: () => void;
}

export function AddButton({ label, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full border border-dashed border-slate-300 rounded-lg p-3 text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700"
    >
      + Add {label}
    </button>
  );
}
