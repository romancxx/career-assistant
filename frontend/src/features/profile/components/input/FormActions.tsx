interface FormActionsProps {
  onCancel: () => void;
  submitting: boolean;
}

export function FormActions({ onCancel, submitting }: FormActionsProps) {
  return (
    <div className="flex gap-2 pt-1">
      <button
        type="submit"
        disabled={submitting}
        className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Save"}
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium"
      >
        Cancel
      </button>
    </div>
  );
}
