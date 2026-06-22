import type { Language, Person } from "@/interfaces/pitch-assistant";
import { DEFAULT_LANGUAGE, DEFAULT_PERSON } from "@/interfaces/pitch-assistant";

export function filterByVoice<T extends { payload: { language?: Language; person?: Person } }>(
  items: T[],
  langFilter: Language | "all",
  personFilter: Person | "all"
): T[] {
  return items.filter((item) => {
    const lang = item.payload.language ?? DEFAULT_LANGUAGE;
    const per = item.payload.person ?? DEFAULT_PERSON;
    return (
      (langFilter === "all" || lang === langFilter) &&
      (personFilter === "all" || per === personFilter)
    );
  });
}
