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
    retry: (failureCount, error: Error) => {
      // Don't retry if it's a 403 Forbidden
      if (error.response?.status === 403) return false;
      return failureCount < 3; // optionally retry other errors up to 3 times
    },
  });
}
