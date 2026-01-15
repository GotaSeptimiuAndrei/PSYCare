import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignHomework } from "../api/taskAPI";

export function useAssignHomework() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignHomework,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientTasks"] });
    },
  });
}
