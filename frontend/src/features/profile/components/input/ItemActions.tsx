interface Props {
  onEdit: () => void;
  onDelete: () => void;
}

export function ItemActions({onEdit, onDelete}: Props) {
  return (
    <>
      <button onClick={onEdit} className="text-xs text-slate-400 hover:text-slate-700">Edit</button>

      <button onClick={onDelete} className="text-xs text-slate-400 hover:text-red-600">Delete</button>
    </>
  );
}
