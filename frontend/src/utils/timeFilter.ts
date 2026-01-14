import type { PatientMoodHistory } from "../types/patient";

export function filterByPeriod(
  data: PatientMoodHistory[],
  days: number
) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return data.filter(
    (d) => new Date(d.date) >= cutoff
  );
}
