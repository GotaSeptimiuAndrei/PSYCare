import axios from "axios";
import { isTokenExpired } from "../utils/jwt";
import type { PatientMoodHistory, PatientsResponse } from "../types/patient";

const API_URL = "http://localhost:8080/api/patients";

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

export async function getPatients(page: number, size: number): Promise<PatientsResponse> {
  const response = await api.get<PatientsResponse>("", {params: {page, size}});
  return response.data;
}

export async function getPatientMoodHistory(patientId: number): Promise<PatientMoodHistory[]> {
  const response = await api.get<PatientMoodHistory[]>(`/${patientId}/mood-history`);
  return response.data;
}
