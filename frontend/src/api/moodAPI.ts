import axios from "axios";
import { isTokenExpired } from "../utils/jwt";
import type { MoodLogEntry } from "../types/mood";

const API_URL = "http://localhost:8080/api/moods";

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

export async function logMood(data: MoodLogEntry) {
  const response = await api.post<MoodLogEntry>("", data);
  return response.data;
}
