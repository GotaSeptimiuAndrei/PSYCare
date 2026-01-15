import axios from "axios";
import { isTokenExpired } from "../utils/jwt";
import type { Task } from "../types/task"; 

const API_URL = "http://localhost:8080/api";

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

export async function assignHomework(assignment: Task): Promise<string> {
  const response = await api.post<string>("/assignments", assignment);
  return response.data;
}

export async function getMyTasks(): Promise<Task[]> {
  const response = await api.get<Task[]>("/patient/tasks");
  return response.data;
}

export async function completeTask(taskId: number): Promise<string> {
  const response = await api.patch<string>(`/assignments/${taskId}/complete`);
  return response.data;
}
