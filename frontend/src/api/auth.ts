import axios from 'axios';
import type { Login, LoginResponse, Register } from '../types/auth';

const API_URL = 'http://localhost:8080/api/auth';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function login(data: Login): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/login', data);
  return response.data;
}

export async function register(data: Register): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/register', data);
  return response.data;
}
