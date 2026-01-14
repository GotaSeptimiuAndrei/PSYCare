import { useQuery } from "@tanstack/react-query";
import { getPatientMoodHistory, getPatients } from "../api/patientAPI";

export function useGetPatients(page: number, size: number = 10) {
  return useQuery({
    queryKey: ["patients", page],
    queryFn: () => getPatients(page, size),
    placeholderData: (previousData) => previousData,
  });
}

export function usePatientMoodHistory(patientId: number, period: string = "1M") {
  return useQuery({
    queryKey: ["patientMoodHistory", patientId, period],
    queryFn: () => getPatientMoodHistory(patientId, period),
    enabled: !!patientId,
  });
}
