import type { ProfileTab } from "@/features/profile/data/useProfile";

interface Props {
  tabs: { key: ProfileTab; label: string; count: number }[];
  active: ProfileTab;
  onSelect: (tab: ProfileTab) => void;
}

export function ProfileTabs({ tabs, active, onSelect }: Props) {
  return (
    <div className="flex gap-2 border-b border-slate-200">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onSelect(t.key)}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            active === t.key
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          {t.label} <span className="text-xs text-slate-400 ml-1">({t.count})</span>
        </button>
      ))}
    </div>
  );
}
