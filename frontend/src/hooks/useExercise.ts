import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllExercises, createExercise, updateExercise, deleteExercise } from "../api/exerciseAPI";
import type { Exercise } from "../types/exercise";


export function useGetAllExercises() {
  return useQuery({
    queryKey: ["exercises"],
    queryFn: getAllExercises,
  });
}

export function useCreateExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
}

export function useUpdateExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, exercise }: { id: number; exercise: Exercise }) =>
      updateExercise(id, exercise),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
}

export function useDeleteExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
}
