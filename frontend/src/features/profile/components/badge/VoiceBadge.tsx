import type { Language, Person } from "@/interfaces/pitch-assistant";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_PERSON,
  LANGUAGE_LABELS,
  PERSON_LABELS
} from "@/interfaces/pitch-assistant";

interface Props {
  language?: Language;
  person?: Person;
}

export function VoiceBadge({ language, person }: Props) {
  const lang = language ?? DEFAULT_LANGUAGE;
  const per = person ?? DEFAULT_PERSON;
  const colorClass =
    lang === "fr" ? "bg-indigo-100 text-indigo-700" : "bg-amber-100 text-amber-700";
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
      {LANGUAGE_LABELS[lang]} · {PERSON_LABELS[per]}
    </span>
  );
}
