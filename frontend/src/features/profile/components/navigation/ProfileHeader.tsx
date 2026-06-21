interface Props {
  backupPending: boolean;
  backupMessage: string | null;
  backupError: boolean;
  onBackup: () => void;
}

export function ProfileHeader({backupPending, backupMessage, backupError, onBackup}: Props) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold mb-1">Profile</h2>

        <p className="text-sm text-slate-600">
          The data that grounds your pitches. Add, edit, or delete experiences,
          skills, pitches, and rules directly here — changes apply immediately.
        </p>
      </div>

      <div className="shrink-0 text-right">
        <button
          onClick={onBackup}
          disabled={backupPending}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50"
        >
          {backupPending ? "Saving…" : "Back up to disk"}
        </button>

        {backupMessage && (
          <p className={`mt-1 text-xs ${backupError ? "text-red-600" : "text-slate-500"}`}>{backupMessage}</p>
        )}
      </div>
    </div>
  );
}
