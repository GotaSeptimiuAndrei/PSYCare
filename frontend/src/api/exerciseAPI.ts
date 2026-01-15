import axios from "axios";
import { isTokenExpired } from "../utils/jwt";
import type { Exercise } from "../types/exercise";

const API_URL = "http://localhost:8080/api/exercises";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      window.location.reload();
      return Promise.reject("Token expired");
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getAllExercises(): Promise<Exercise[]> {
  const response = await api.get<Exercise[]>("");
  return response.data;
}

export async function createExercise(exercise: Exercise): Promise<Exercise> {
  const response = await api.post<Exercise>("", exercise);
  return response.data;
}

export async function updateExercise(id: number, exercise: Exercise): Promise<Exercise> {
  const response = await api.put<Exercise>(`/${id}`, exercise);
  return response.data;
}

export async function deleteExercise(id: number): Promise<string> {
  const response = await api.delete<string>(`/${id}`);
  return response.data;
}
