interface Props {
  onClick: () => void;
}

export function RemoveBtn({onClick}: Props) {
  return (
    <button onClick={onClick} className="text-slate-400 hover:text-red-600 text-sm px-2 py-1" title="Remove">
      ✕
    </button>
  );
}
