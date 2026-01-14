import { useMutation } from "@tanstack/react-query";
import { logMood } from "../api/moodAPI";
import type { MoodLogEntry } from "../types/mood";

export function useLogMood() {
  return useMutation({
    mutationFn: (data: MoodLogEntry) => logMood(data),
  });
}
