interface Props {
  label: string;
  onClick: () => void;
}

export function AddBtn({label, onClick}: Props) {
  return (
    <button onClick={onClick} className="text-xs text-slate-600 hover:text-slate-900 font-medium">
      + {label}
    </button>
  );
}
