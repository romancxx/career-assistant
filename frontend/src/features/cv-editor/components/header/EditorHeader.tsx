interface Props {
  saved: boolean;
  saving: boolean;
  downloading: boolean;
  onSave: () => void;
  onDownload: () => void;
}

export function EditorHeader({saved, saving, downloading, onSave, onDownload}: Props) {
  return (
    <div className="flex items-center justify-between sticky top-0 bg-slate-50 py-2 z-10">
      <h2 className="text-lg font-semibold">Edit CV</h2>

      <div className="flex items-center gap-3">
        {saved && <span className="text-sm text-green-600">Saved</span>}

        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 border border-slate-300 text-slate-900 rounded-md text-sm font-medium disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>

        <button
          onClick={onDownload}
          disabled={downloading}
          className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium disabled:opacity-50"
        >
          {downloading ? "Rendering…" : "Download PDF"}
        </button>
      </div>
    </div>
  );
}
