import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assignHomework, getMyTasks, completeTask } from "../api/taskAPI";

export function useAssignHomework() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignHomework,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientTasks"] });
    },
  });
}

export function useGetMyTasks() {
  return useQuery({
    queryKey: ["myTasks"],
    queryFn: getMyTasks,
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTasks"] });
    },
  });
}
